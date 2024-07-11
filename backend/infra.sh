#!/bin/sh/

# create redis service
docker rm -f redis
docker run -d -p 6379:6379 --name=redis redis:latest