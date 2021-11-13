FROM node:lts-alpine
COPY node_modules node_modules
COPY build .
CMD ["node", "index.js"]
EXPOSE 9000