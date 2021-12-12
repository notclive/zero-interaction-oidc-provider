FROM node:lts-alpine
COPY . .
CMD ["node", "index.js"]
EXPOSE 9000