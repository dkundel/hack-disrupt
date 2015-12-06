FROM ubuntu:15.10

RUN apt-get update
RUN apt-get -y install sudo
RUN apt-get -y install curl

RUN curl -sL https://deb.nodesource.com/setup_5.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g nodemon

COPY package.json /src/package.json
RUN cd /src; npm install

COPY . /src
EXPOSE 3000
CMD ["node", "/src/app.js"]