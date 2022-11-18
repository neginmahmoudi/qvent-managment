# Set the OS with Node.js
FROM node:18-alpine AS builder
# Install necessary tools
RUN apk add --no-cache libc6-compat yq --repository=http://dl-cdn.alpinelinux.org/alpine/edge/community
# Create a directory called app
WORKDIR /app
# Copy the content of the project to the machine
COPY . .
# Set an environmental variable
ENV NODE_ENV production
ENV FLY_IO true
RUN yq --inplace --output-format=json '.dependencies = .dependencies * (.devDependencies | to_entries | map(select(.key | test("^(typescript|@types/*|@upleveled/)"))) | from_entries)' package.json
RUN yarn install --frozen-lockfile
RUN yarn build

# Initialize production layer
FROM node:18-alpine AS runner
# Install necessary tools
ENV NODE_ENV production
RUN apk add bash postgresql
WORKDIR /app

# Copy built app
COPY --from=builder /app/.next ./.next

# Copy only necessary files to run the app (minimize production app size, improve performance)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

# Copy start script and make it executable
COPY --from=builder /app/scripts ./scripts
RUN chmod +x /app/scripts/fly-io-start.sh

ENV FLY_IO true
ENV PORT 8080

CMD ["./scripts/fly-io-start.sh"]
