# Burdoc

A Markdown editor for the cloud.

## Setup

### Install Homebrew

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

### Install Nginx

```bash
brew install nginx
```

### Install OpenSSL

```bash
brew install openssl
```

### Install PostgreSQL

```bash
brew install postgres
postgres -D /usr/local/var/postgres
```

### Create PostgreSQL Database

```bash
createdb burdoc
```

### Clone Project

```bash
git clone git@github.com:calebkleveter/Burdoc.git
cd Burdoc/
```

### Create SSL Certificates

```bash
openssl req \
-newkey rsa:2048 \
-nodes \
-keyout ssl.key \
-x509 \
-reqexts SAN \
-extensions SAN \
-config <(cat /etc/ssl/openssl.cnf \
<(printf '[SAN]\nsubjectAltName=DNS:burdoc.caleb,IP:127.0.0.1')) \
-days 365 \
-out ssl.crt
```

### Start Nginx

```bash
nginx -c $(pwd)/nginx.conf
```

### Build App

```bash
npm install
npm run build
```