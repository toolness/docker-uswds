FROM ruby:2.4.1

# https://nodejs.org/en/download/package-manager/

RUN apt-get update && \
    curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
    apt-get install -y nodejs zip

COPY web-design-standards-docs/Gemfile* web-design-standards-docs/

WORKDIR /web-design-standards-docs

RUN bundle

WORKDIR /

# Hacky equivalent for https://github.com/jekyll/jekyll-redirect-from/pull/155
COPY fixed-jekyll-redirect-from-redirect.html /usr/local/bundle/gems/jekyll-redirect-from-0.12.1/lib/jekyll-redirect-from/redirect.html

RUN npm install -g yarn
