from node:20

workdir /app
copy . /app

run npm ci

EXPOSE 8080
CMD [ "npm", "run", "deploy-commands-and-start" ]