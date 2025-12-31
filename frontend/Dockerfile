FROM node:20-alpine

RUN corepack enable

# or you could do this i guess RUN npm install -g pnpm

WORKDIR /frontend

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 5173

CMD  ["pnpm", "run", "dev", "--host"]