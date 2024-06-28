
## Server install instruction: 

https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-ubuntu-18-04 

## start from update

```
apt update
apt upgrade
```

## Create sudo user

https://www.digitalocean.com/community/tutorials/how-to-create-a-new-sudo-enabled-user-on-ubuntu-22-04-quickstart

```
adduser ilja 
usermod -aG sudo ilja
```

## Install nginx 
https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-18-04

```
sudo apt install nginx
sudo systemctl restart nginx
nginx -t
```

### configure firewall

```
sudo ufw app list
```

check status
```
sudo ufw status
```

and if it inactive active
```
sudo ufw enable
```


## install php

```
sudo apt install php php-cli php-fpm php-mysql php-mbstring php-curl php-xml
```

## install git and MC

```
sudo apt install mc git
```

## install mysql, and reset password 
https://www.digitalocean.com/community/tutorials/how-to-install-linux-nginx-mysql-php-lemp-stack-ubuntu-18-04

```
sudo apt install mysql-server
sudo mysql_secure_installation
```

### set new password
```
sudo mysql
```

### download project

```
git clone https://github.com/Iljaaa/tetrinet.git
```

### update nginx configuration


## install redis

## install certbot 

https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-22-04


## configure socket ssl

in config/websockets.php
```
 'ssl' => [
        'local_cert' => env('LARAVEL_WEBSOCKETS_SSL_LOCAL_CERT', null),

        'local_pk' => env('LARAVEL_WEBSOCKETS_SSL_LOCAL_PK', null),

        // add this option
        'verify_peer' => false,

        
        'passphrase' => env('LARAVEL_WEBSOCKETS_SSL_PASSPHRASE', null),
    ],

```

in .env 
```
APP_SOCKET=wss://tetrinet.online:6001/websocket
LARAVEL_WEBSOCKETS_SSL_LOCAL_CERT=/etc/letsencrypt/live/tetrinet.online/fullchain.pem
LARAVEL_WEBSOCKETS_SSL_LOCAL_PK=/etc/letsencrypt/live/tetrinet.online/privkey.pem
```

where LARAVEL_WEBSOCKETS_SSL_LOCAL_CERT and LARAVEL_WEBSOCKETS_SSL_LOCAL_PK from nginx config after install cert



## Run socket



### install supervisord

```
sudo apt install supervisor
```

### set config file 

in path
```
touch /etc/supervisor/conf.d/websocket.conf
```

with content
```
[program:websocket]
command=php /var/www/tetrinet/src/server/artisan websockets:serve --port 6001
directory=/var/www/tetrinet/src/server
user=www-data
autostart=true
autorestart=true
```

then restart supervisord
```
sudo systemctl restart supervisor
```

Start, restart, 
```

```

