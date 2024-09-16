# Start with a node 21 image with package info
# Installs *all* pnpm packages and runs build script
FROM node:21.1.0-alpine AS workspace

# private git packages
ARG GITHUB_NPM_TOKEN
ENV GITHUB_NPM_TOKEN=${GITHUB_NPM_TOKEN}

WORKDIR /app
RUN npm install -g pnpm
COPY [".", "/app/"]
RUN pnpm install

FROM workspace AS build
ARG VITE_EPSILON_API_PREFIX
ENV VITE_EPSILON_API_PREFIX=${VITE_EPSILON_API_PREFIX}
ARG VITE_EPSILON_COOKIE_PREFIX
ENV VITE_EPSILON_COOKIE_PREFIX=${VITE_EPSILON_COOKIE_PREFIX}

WORKDIR /app
ENV NODE_ENV=production
RUN pnpm build

# # startup and copy the sources for APP
FROM nginx:stable-alpine AS production
COPY ./conf/nginx.conf /etc/nginx/conf.d/default.conf         
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]