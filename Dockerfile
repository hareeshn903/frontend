# ---------- Stage 1: Build ----------
    FROM node:20-alpine AS build

    WORKDIR /app
    
    # install dependencies separately (better caching)
    COPY package*.json ./
    RUN npm ci
    
    # copy source
    COPY . .
    
    # build production files
    RUN npm run build
    
    
    # ---------- Stage 2: Serve ----------
    FROM nginx:alpine
    
    # remove default nginx static files
    RUN rm -rf /usr/share/nginx/html/*
    
    # copy build output
    COPY --from=build /app/build /usr/share/nginx/html
    
    # custom nginx config (optional but recommended)
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    EXPOSE 80
    
    CMD ["nginx", "-g", "daemon off;"]