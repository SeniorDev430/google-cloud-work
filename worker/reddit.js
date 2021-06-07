'use strict';

const request = require('request-promise');
const util = require('util');
const logger = require('./logger');

async function getImageUrls() {
  logger.info("Request data from reddit...");
  const allPosts = [];
  const pagesToFetch = 3;
  let after = null;
  for (let i=0; i<pagesToFetch; i++) {
    logger.info(`Loading page: ${after}`);
    after = await _populatePageUrls(after, allPosts);
    logger.info(`Done loading page!`);
  }
  logger.info('Reddit data request complete: ' + allPosts.length);
  return allPosts;
}

async function _populatePageUrls(after, allPosts) {
  logger.info('populating page urls...');
  const page = await _getPage(after);
  logger.info(`loaded page ${page.after}!`);
  const posts = page.children.filter(post => {
    return post.data &&
            post.data.preview &&
            post.data.preview.images &&
            post.data.preview.images.length > 0;
  }).map(post => {
    return post.data.preview.images[0].source.url;
  });
  console.log(posts);
  Array.prototype.push.apply(allPosts, posts);
  logger.info(`Pushed ${posts.length} items`);
  return page.after;
}

async function _getPage(after) {

  let options = {
    url: 'https://www.reddit.com/r/aww/hot.json',
    json: true,
    headers: {
      'User-Agent': 'justinbeckwith:cloudcats:v1.0.0 (by /u/justinblat)'
    },
    qs: {
      after: after
    }
  };

  const res = await request(options);
  return res.data;
}

module.exports = {
  getImageUrls: getImageUrls
};