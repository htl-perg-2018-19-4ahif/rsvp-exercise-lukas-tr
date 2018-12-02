FROM node:10

WORKDIR /usr/src/app

COPY . .

RUN npm i \
  && cd rsvp-app \
  && npm i \
  && cd ..

EXPOSE 8080
CMD [ "npm", "start" ]