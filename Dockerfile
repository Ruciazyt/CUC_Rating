FROM node:18.10-alpine AS builder

ADD cuc-rating-admin /cuc-rating-admin

WORKDIR /cuc-rating-admin

RUN npm install && npm run build:prod


ADD cuc-rating-vite /cuc-rating-vite

WORKDIR /cuc-rating-vite

RUN npm install && npm run build


FROM nginx:1.25.2-alpine3.18

COPY --from=builder /cuc-rating-admin/dist /usr/share/nginx/html/admin
COPY --from=builder /cuc-rating-vite/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf