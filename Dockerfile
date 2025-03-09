FROM node:22-alpine AS base

WORKDIR /app

# Стадия для разработки
FROM base AS dev
ENV NODE_ENV=development
COPY . .  
RUN yarn install --frozen-lockfile
CMD ["yarn", "start:dev"]

# Стадия для production
FROM base AS production
ENV NODE_ENV=production
COPY package*.json yarn.lock ./  
RUN yarn install --frozen-lockfile  
COPY . .  
RUN yarn build  

# Финальный образ
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=production /app/node_modules ./node_modules
COPY --from=production /app/dist ./dist
COPY --from=production /app/package.json /app/yarn.lock ./  

RUN chown -R node:node /app
USER node

CMD ["node", "dist/main.js"]
