from node:20

workdir /app
copy . /app

run npm ci
CMD ["npm", "start"]