FROM node:22 AS builder

WORKDIR /app
ENV VITE_API_BASE_URL=https://api.greymarketwiki.com/api/v1

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
