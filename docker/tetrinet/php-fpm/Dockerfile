FROM php:8.1-fpm

RUN apt-get update

# php-mysql
RUN docker-php-ext-install pdo pdo_mysql mysqli

# sockets
RUN docker-php-ext-install sockets

# memcache
#RUN apt-get install -y libmemcached-dev zlib1g-dev \
#    && pecl install memcached-3.1.5 \
#    && docker-php-ext-enable memcached

# redis
RUN pecl install redis && docker-php-ext-enable redis
# RUN apt-get install -y redis-cli
#RUN apt-get install -y redis \
#    && /etc/init.d/redis-server start

# модули PHP redis & xdebug
# https://blog.denisbondar.com/post/phpstorm_docker_xdebug
#RUN pecl install redis \
#    && docker-php-ext-enable redis \
RUN pecl install xdebug-3.2.1 \
    && docker-php-ext-enable xdebug

# send mail
# RUN apt-get install -y sendmail

# PHP-GD
RUN apt-get install -y libpng-dev zlib1g-dev
RUN docker-php-ext-install gd

ADD ./php.ini /usr/local/etc/php/php.ini

# либа печати пдф
# RUN apt-get install -y xvfb libfontconfig wkhtmltopdf

# zip
#RUN apt-get install -y zip

# libzip для php zip
#RUN apt-get install -y libzip-dev

# php-zip
#RUN docker-php-ext-install zip

# libs 4 mbstring
#RUN apt-get install -y libonig-dev libpq-dev

# mbstring
#RUN docker-php-ext-install mbstring

# PCNTL
RUN docker-php-ext-install pcntl

# this is for ps and lsof
RUN apt-get update && apt-get install -y procps
RUN apt-get update && apt-get install -y lsof


WORKDIR /var/www
