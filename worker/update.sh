#!/bin/bash
TAG=$(date +%s)
docker build -t gcr.io/cloudcats-next/ccworker:$TAG .
docker push gcr.io/cloudcats-next/ccworker:$TAG
kubectl set image deployment cloudcats-worker cloudcats-worker=gcr.io/cloudcats-next/ccworker:$TAG
kubectl rollout status deployment cloudcats-worker
