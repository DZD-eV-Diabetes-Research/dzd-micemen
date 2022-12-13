FROM node:19 as build-stage
WORKDIR /app
COPY app /app
RUN ls /app
RUN npm install
RUN npm run build
FROM nginx:1.23
COPY --from=build-stage  /app/dist /usr/share/nginx/html
RUN ls /usr/share/nginx/html
