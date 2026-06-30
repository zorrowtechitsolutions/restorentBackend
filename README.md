# FoodScan Backend - Docker Setup

This repository contains the microservices architecture for FoodScan with Docker and Docker Compose setup.

## Services

- **api-gateway** (Port 3000): API Gateway that routes requests to microservices
- **user-service** (Port 3002): User management service
- **company-service** (Port 3001): Company management service
- **items-service** (Port 3003): Items/menu management service
- **role-service** (Port 3016): Role and permission management service
- **hr-service** (Port 3004): HR management service
- **rabbitmq** (Ports 5672, 15672): Message broker for inter-service communication

## Prerequisites

- Docker Desktop installed
- Docker Compose installed

## Quick Start

1. Clone the repository
2. Ensure all service `.env` files are configured with proper database and RabbitMQ credentials
3. Start all services:

```bash
docker-compose up -d
```

4. View logs:
```bash
docker-compose logs -f
```

5. Stop services:
```bash
docker-compose down
```

## Service Configuration

Each service has its own `.env` file in its respective directory. Ensure these are configured before starting:

- `api-gateway/.env`: Gateway configuration and service URLs
- `user-service/.env`: User service database and environment variables
- `company-service/.env`: Company service database and environment variables
- `items-service/.env`: Items service database and environment variables
- `role-service/.env`: Role service database and environment variables
- `hr-service/.env`: HR service database and environment variables

## API Gateway Routes

The API Gateway routes requests to the appropriate microservices:

- `/api/users/*` → user-service
- `/api/companies/*` → company-service
- `/api/items/*` → items-service
- `/api/roles/*` → role-service
- `/api/hr/*` → hr-service

## Health Checks

All services include health check endpoints:

- API Gateway: `http://localhost:3000/health`
- User Service: `http://localhost:3002/health`
- Company Service: `http://localhost:3001/health`
- Items Service: `http://localhost:3003/health`
- Role Service: `http://localhost:3016/health`
- HR Service: `http://localhost:3004/health`

## RabbitMQ Management UI

Access the RabbitMQ management interface at: `http://localhost:15672`
- Default username: guest
- Default password: guest

## Development

To run individual services in development mode:

```bash
cd <service-name>
npm run dev
```

To build a specific service:

```bash
cd <service-name>
npm run build
```

## Database Migrations

All services run database migrations automatically on startup using Sequelize CLI. To run migrations manually:

```bash
cd <service-name>
npm run migrate
```

## Network Configuration

Services communicate via the `foodscan-network` Docker network with custom MTU settings for optimal performance.

## Troubleshooting

1. If services fail to start, check logs: `docker-compose logs <service-name>`
2. Ensure database credentials in `.env` files are correct
3. Verify RabbitMQ is accessible: `http://localhost:15672`
4. Check port conflicts if services don't start

## Building Images

To rebuild all images:

```bash
docker-compose build
```

To rebuild a specific service:

```bash
docker-compose build <service-name>
```
