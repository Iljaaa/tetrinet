
## Server install instruction: 

https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-ubuntu-18-04 

### Create sudo user

https://www.digitalocean.com/community/tutorials/how-to-create-a-new-sudo-enabled-user-on-ubuntu-22-04-quickstart

```
adduser ilja 
usermod -aG sudo ilja
```

```
apt update
```

### Install nginx 
https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-18-04

```
sudo apt install php php-cli php-fpm php-mysql php-mbstring php-curl
sudo apt install mc git
```

### update nginx configuration

### install mysql, and reset password 
https://www.digitalocean.com/community/tutorials/how-to-install-linux-nginx-mysql-php-lemp-stack-ubuntu-18-04

### download project

### install redis


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
```angular2html
[program:websocket]
command=php /var/www/tetrinet/src/server/artisan websockets:serve --port 10000
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

