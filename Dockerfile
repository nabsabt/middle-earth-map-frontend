#FROM node:20-alpine AS build
#WORKDIR /app
#COPY package*.json ./
#RUN npm ci
#COPY . .
#RUN npm run build -- --configuration production

#FROM nginx:alpine
#RUN rm -f /etc/nginx/conf.d/*.conf || true
#RUN rm -rf /etc/nginx/templates || true
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#COPY --from=build /app/dist/browser/ /usr/share/nginx/html/
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]

FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build --prod

FROM nginx:alpine
COPY --from=build /app/dist/browser/ /usr/share/nginx/html/
#COPY --from=build /app/dist/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
