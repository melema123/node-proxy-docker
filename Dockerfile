FROM node:current-slim

WORKDIR /opt/app/

COPY proxy.js config.js ./

CMD [ "node", "proxy.js" ]