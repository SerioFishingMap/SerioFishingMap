FROM node:22

RUN apt-get update -qq && apt-get install --no-install-recommends -y openssh-client

WORKDIR /workspace
    
COPY ../package.json ../package-lock.json ./

RUN npm install

COPY . .