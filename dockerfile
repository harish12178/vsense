FROM stefanscherer/node-windows:10

RUN mkdir usr
RUN cd usr
RUN mkdir src
RUN cd src
RUN mkdir app
RUN cd app

WORKDIR /usr/src/app

RUN npm install -g @angular/cli

COPY . /usr/src/app

CMD ng serve --host 0.0.0.0 --port 4200