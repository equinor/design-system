FROM node:12 as builder
# RUN apt-get install -y git
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ENV PORT=9001
EXPOSE 9001

CMD [ "npm", "start" ]
