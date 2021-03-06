FROM ruby:2.4.1

# https://nodejs.org/en/download/package-manager/

RUN apt-get update && \
    curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
    apt-get install -y nodejs zip

WORKDIR /

ENV PATH "$PATH:./node_modules/.bin"
