# GCP Deployment Configuration for Compute Engine

## Prerequisites
- Google Cloud account
- GCP project created
- gcloud CLI installed and authenticated
- Docker installed locally

## Steps to Deploy

### 1. Configure GCP Project
```bash
# Set your project ID
export PROJECT_ID="your-project-id"
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable compute.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 2. Build and Push Docker Image
```bash
# Build the Docker image
cd backend
docker build -t anti-hate-api:latest .

# Tag for GCR
docker tag anti-hate-api:latest gcr.io/$PROJECT_ID/anti-hate-api:latest

# Configure Docker for GCR
gcloud auth configure-docker

# Push to GCR
docker push gcr.io/$PROJECT_ID/anti-hate-api:latest
```

### 3. Create Compute Engine Instance
```bash
# Create a VM instance with container
gcloud compute instances create-with-container anti-hate-api-vm \
    --container-image=gcr.io/$PROJECT_ID/anti-hate-api:latest \
    --machine-type=e2-standard-2 \
    --zone=us-central1-a \
    --tags=http-server,https-server \
    --container-env=PORT=5000,FLASK_ENV=production \
    --container-restart-policy=always

# For GPU support (better performance):
gcloud compute instances create-with-container anti-hate-api-vm-gpu \
    --container-image=gcr.io/$PROJECT_ID/anti-hate-api:latest \
    --machine-type=n1-standard-4 \
    --zone=us-central1-a \
    --accelerator=type=nvidia-tesla-t4,count=1 \
    --maintenance-policy=TERMINATE \
    --tags=http-server,https-server \
    --container-env=PORT=5000,FLASK_ENV=production \
    --container-restart-policy=always
```

### 4. Configure Firewall Rules
```bash
# Allow HTTP traffic
gcloud compute firewall-rules create allow-http-5000 \
    --allow=tcp:5000 \
    --source-ranges=0.0.0.0/0 \
    --target-tags=http-server \
    --description="Allow HTTP traffic on port 5000"
```

### 5. Get Instance IP
```bash
# Get external IP
gcloud compute instances describe anti-hate-api-vm \
    --zone=us-central1-a \
    --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
```

### 6. Test Deployment
```bash
# Replace <EXTERNAL_IP> with your instance IP
curl http://<EXTERNAL_IP>:5000/api/health
```

## Update Deployment

```bash
# Rebuild and push new image
docker build -t anti-hate-api:latest ./backend
docker tag anti-hate-api:latest gcr.io/$PROJECT_ID/anti-hate-api:latest
docker push gcr.io/$PROJECT_ID/anti-hate-api:latest

# Update the instance
gcloud compute instances update-container anti-hate-api-vm \
    --container-image=gcr.io/$PROJECT_ID/anti-hate-api:latest \
    --zone=us-central1-a
```

## Monitoring

```bash
# View logs
gcloud compute instances get-serial-port-output anti-hate-api-vm \
    --zone=us-central1-a

# SSH into instance
gcloud compute ssh anti-hate-api-vm --zone=us-central1-a

# Check container status
docker ps
docker logs <container-id>
```

## Cost Optimization

- Use preemptible instances for development: `--preemptible`
- Scale down machine type if not needed: `--machine-type=e2-micro`
- Set up auto-shutdown during inactive hours
- Use committed use contracts for production

## Security

- Use HTTPS with SSL certificate
- Restrict CORS origins in production
- Set up Cloud Armor for DDoS protection
- Use VPC for network isolation
- Enable Cloud Logging and Monitoring
