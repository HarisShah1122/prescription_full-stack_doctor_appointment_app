# 🐳 Docker Deployment Guide

This guide will help you deploy the Prescription Full-Stack Doctor Appointment App using Docker and Docker Compose.

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose installed (usually comes with Docker Desktop)
- At least 4GB of available RAM
- 2GB of free disk space

## 🚀 Quick Start

### 1. Clone and Navigate
```bash
git clone https://github.com/HarisShah1122/prescription_full-stack_doctor_appointment_app.git
cd prescription_full-stack_doctor_appointment_app
```

### 2. Environment Configuration
```bash
# Copy the Docker environment template
cp .env.docker .env

# Edit the .env file with your actual values
nano .env  # or use your preferred editor
```

**Important**: Update these values in your `.env` file:
- `JWT_SECRET`: Generate a strong secret key
- `STRIPE_SECRET_KEY`: Your Stripe test/production key
- `CLOUDINARY_*`: Your Cloudinary credentials

### 3. Deploy with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### 4. Access the Application
- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:4000
- **MongoDB**: localhost:27017

## 🏗️ Architecture

The Docker setup consists of three main services:

### Services Overview

1. **MongoDB Database** (`mongodb`)
   - Image: `mongo:6.0`
   - Port: `27017:27017`
   - Persistent data volume
   - Auto-seeds with mock data

2. **Backend API** (`backend`)
   - Custom build from `backend/Dockerfile`
   - Port: `4000:4000`
   - Node.js 18 Alpine
   - Health checks enabled

3. **Frontend Web** (`frontend`)
   - Multi-stage build (builder + nginx)
   - Port: `80:80`
   - Serves static React app
   - API proxy to backend

### Network Configuration
All services communicate through a dedicated Docker network `prescription_network` for secure inter-service communication.

## 📝 Useful Commands

### Development Commands
```bash
# Start services in development mode
docker-compose up

# Rebuild specific service
docker-compose up -d --build backend

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Production Commands
```bash
# Deploy to production
docker-compose -f docker-compose.yml up -d

# Scale services (if needed)
docker-compose up -d --scale backend=2

# Update services
docker-compose pull
docker-compose up -d
```

### Maintenance Commands
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This deletes data!)
docker-compose down -v

# Clean up unused Docker resources
docker system prune -a
```

### Database Management
```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p password123 --authenticationDatabase admin

# Backup database
docker-compose exec mongodb mongodump --host localhost --port 27017 --db prescription_full-stack_doctor -u admin -p password123 --authenticationDatabase admin

# Restore database
docker-compose exec -T mongodb mongorestore --host localhost --port 27017 --db prescription_full-stack_doctor -u admin -p password123 --authenticationDatabase admin --archive < backup.archive
```

## 🔧 Configuration

### Environment Variables
Key environment variables for Docker deployment:

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | JWT signing secret | Required |
| `STRIPE_SECRET_KEY` | Stripe API key | Required |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Required |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Required |
| `CLOUDINARY_API_SECRET` | Cloudinary secret | Required |
| `NODE_ENV` | Environment | `production` |
| `PORT` | Backend port | `4000` |
| `CURRENCY` | Default currency | `PKR` |

### Port Configuration
Default port mappings:
- Frontend: `80:80` (HTTP)
- Backend: `4000:4000` (API)
- MongoDB: `27017:27017` (Database)

### Volume Persistence
- `mongodb_data`: MongoDB data persistence
- `backend_uploads`: File upload storage

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :80
   # Stop conflicting service or change port in docker-compose.yml
   ```

2. **Permission Denied**
   ```bash
   # Fix Docker permissions (Linux/Mac)
   sudo usermod -aG docker $USER
   
   # Restart Docker service
   sudo systemctl restart docker
   ```

3. **Out of Memory**
   ```bash
   # Increase Docker memory allocation in Docker Desktop settings
   # Recommended: 4GB+ RAM
   ```

4. **Build Failures**
   ```bash
   # Clear Docker cache
   docker system prune -a
   
   # Rebuild from scratch
   docker-compose build --no-cache
   ```

### Health Check Issues
```bash
# Check service health
docker-compose ps

# View health check logs
docker inspect prescription_backend | grep Health -A 10
```

### Database Connection Issues
```bash
# Test MongoDB connection
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Check logs
docker-compose logs mongodb
```

## 🚀 Production Deployment

### Security Considerations
1. **Update Default Passwords**: Change MongoDB credentials
2. **Use HTTPS**: Configure SSL certificates
3. **Environment Variables**: Never commit secrets to git
4. **Network Security**: Use firewall rules
5. **Regular Updates**: Keep Docker images updated

### Performance Optimization
1. **Resource Limits**: Set memory/CPU limits in docker-compose.yml
2. **Load Balancing**: Use multiple backend instances
3. **CDN**: Serve static assets via CDN
4. **Database Indexing**: Ensure proper MongoDB indexes

### Monitoring
```bash
# Monitor resource usage
docker stats

# Monitor logs
docker-compose logs -f --tail=100
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Docker logs: `docker-compose logs`
3. Verify environment variables
4. Ensure Docker Desktop is running properly
5. Check system resources (memory, disk space)

---

**Note**: This Docker setup is optimized for development and small-scale production deployments. For enterprise deployments, consider using Kubernetes or Docker Swarm for orchestration.
