FROM node:20-alpine
# Break everything :)
ENV PIP_BREAK_SYSTEM_PACKAGES=1

# Install basic development tools
# RUN apt-get update && apt-get install -y python3 python3-venv python3-pip
RUN apk add --update --no-cache python3 cmd:pip3 && \
	apk add --update --no-cache --virtual build-deps python3-dev gcc python3-dev musl-dev linux-headers && \
	ln -sf python3 /usr/bin/python && \
	pip3 install --no-cache --upgrade pip setuptools psutil --break-system-packages && \
	apk del build-deps