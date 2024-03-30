#!/bin/bash

docker build -t desafio-ibs-api .

docker tag desafio-ibs-api adnanioricce/desafio-ibs-api

docker run -d -p 8185:3000 your-image-name

sleep 25

npm run e2e

docker push adnanioricce/desafio-ibs-api
