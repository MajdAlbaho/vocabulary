FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build --prod

FROM nginx:alpine

COPY --from=build /app/dist/tivo/browser /usr/share/nginx/html

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
