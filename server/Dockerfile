FROM golang:1.24.4-alpine

# Install git + Air
RUN apk update && apk add --no-cache git curl && \
    go install github.com/air-verse/air@latest
    
# Set working directory
WORKDIR /app

# Copy go.mod first for layer caching
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of your source code
COPY . .

# Expose server port
EXPOSE 8080

# Use Air for hot reload
CMD ["air"]
