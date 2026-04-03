FROM node:22 AS builder

WORKDIR /app
ENV VITE_API_BASE_URL=https://api.greymarketwiki.com/api/v1
ENV VITE_GOOGLE_CLIENT_ID=249833028550-jmpsoskd6ktkkflqmbkrgd1hj2461uf9.apps.googleusercontent.com
ENV VITE_GOOGLE_REDIRECT_URI=https://titlesnap.in


COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
