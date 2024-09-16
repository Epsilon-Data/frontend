# Start with a node 18 image with package info
# Installs *all* pnpm packages and runs build script
FROM node:18.12.1-alpine as workspace

# private git packages
ARG GITHUB_NPM_TOKEN
ENV GITHUB_NPM_TOKEN=${GITHUB_NPM_TOKEN}

WORKDIR /app
RUN npm install -g pnpm
COPY [".", "/app/"]
RUN pnpm install

FROM workspace as build
WORKDIR /app
ENV NODE_ENV=production
RUN pnpm build

# # startup and copy the sources for APP
FROM nginx:stable-alpine as production
COPY ./conf/nginx.conf /etc/nginx/conf.d/default.conf         
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]