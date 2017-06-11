FROM ruby:2.4.1

# https://nodejs.org/en/download/package-manager/

RUN apt-get update && \
    curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
    apt-get install -y nodejs

COPY web-design-standards-docs/Gemfile* web-design-standards-docs/

WORKDIR /web-design-standards-docs

RUN bundle

WORKDIR /

RUN apt-get install -y zip
