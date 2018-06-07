FROM ruby:2.4.1

# https://nodejs.org/en/download/package-manager/

RUN apt-get update && \
    curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
    apt-get install -y nodejs zip

WORKDIR /

RUN npm install -g yarn@1.6.0

ENV PATH "$PATH:./node_modules/.bin"
