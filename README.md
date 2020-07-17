
### Introduction

This is a very simple http proxy. It listens and forwards the request to remote service specified in config.js.
I created it to troubleshoot problems between services(or docker containers) in situations where the services do not print requests and responses in their logs. 

### Usage

#### Clone from the code
`git clone https://github.com/melema123/node-proxy-docker.git`
`cd node-proxy-docker`

#### Build docker image
`docker build --tag simple-node-http-proxy:1.0 .`

#### Run the image as container
`docker run -d -p 9000:9000 -v $(pwd)/config.js:/opt/app/config.js:ro --name simple_node_proxy simple-node-http-proxy:1.0`
