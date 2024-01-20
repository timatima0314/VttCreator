FROM php:8.1-fpm

# 必要なパッケージのインストールとDocker PHP Extensionsのインストール
RUN apt-get update && apt-get upgrade -y && \
  apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev zip git unzip ffmpeg && \
  docker-php-ext-configure gd --with-freetype --with-jpeg && \
  docker-php-ext-install gd pdo pdo_mysql && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Composerのインストール
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Node.jsのインストール
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
  apt-get install -y nodejs npm

RUN echo "file_uploads = On\n" \
         "memory_limit = 500M\n" \
         "upload_max_filesize = 500M\n" \
         "post_max_size = 500M\n" \
         "max_execution_time = 600\n" \
         > /usr/local/etc/php/conf.d/uploads.ini