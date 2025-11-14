# Deployment Guide

This guide covers deploying `code-intelligence-mcp` in different environments and scenarios.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Team Shared Configuration](#team-shared-configuration)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment](#cloud-deployment)
5. [CI/CD Integration](#cicd-integration)

## Local Development Setup

### Quick Start

```bash
# Install package
npm install code-intelligence-mcp

# Navigate to project or package directory
cd /path/to/your/project

# Run setup script
npm run setup:dev

# Follow the interactive prompts:
# 1. Create data/config.json with your AI provider keys
# 2. Create data/components.json with your components
# 3. Create data/utils.json with your utilities

# Start development server
npm run dev
```

### Manual Setup (without setup script)

```bash
# Copy example files
cp node_modules/code-intelligence-mcp/data/config.example.json data/config.json
cp node_modules/code-intelligence-mcp/data/components.example.json data/components.json
cp node_modules/code-intelligence-mcp/data/utils.example.json data/utils.json

# Edit configuration files
vim data/config.json         # Add your API keys
vim data/components.json     # Add your components
vim data/utils.json          # Add your utilities

# Start
npm run dev
```

## Team Shared Configuration

### Option 1: Version Control with Secrets Management

Store example/template files in git, secrets separately:

```bash
# File structure
project/
├── data/
│   ├── config.json           # .gitignore'd, contains secrets
│   ├── config.template.json  # Committed, shows structure
│   ├── components.json       # Your actual components
│   └── utils.json            # Your actual utilities
├── .env.example              # Environment variables template
└── .gitignore                # Excludes config.json
```

**Configuration Template** (`data/config.template.json`):

```json
{
  "defaultModel": "${DEFAULT_MODEL}",
  "providers": [
    {
      "provider": "openai",
      "models": [
        {
          "model": "gpt-4o",
          "title": "GPT-4o",
          "baseURL": "${OPENAI_BASE_URL}",
          "apiKey": "${OPENAI_API_KEY}"
        }
      ]
    }
  ]
}
```

**Setup Script for Team** (`scripts/team-setup.sh`):

```bash
#!/bin/bash

# Team member setup script
echo "Setting up code-intelligence-mcp for team..."

# Copy template
cp data/config.template.json data/config.json

# Instructions
echo ""
echo "⚠️  IMPORTANT: Configure your API keys"
echo "Edit data/config.json and set:"
echo "  - OPENAI_API_KEY: from https://platform.openai.com/api-keys"
echo "  - Default model and other providers as needed"
echo ""
echo "You can set environment variables to avoid editing the file:"
echo "  export OPENAI_API_KEY=sk-..."
echo "  export DEFAULT_MODEL=gpt-4o"
echo ""

npm run dev
```

### Option 2: Environment Variables

Use environment variables for secrets:

```bash
# .env file (in .gitignore)
GAREN_MCP_CONFIG=/path/to/config.json
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...
```

**Configuration with env vars** (`data/config.json`):

```json
{
  "defaultModel": "gpt-4o",
  "providers": [
    {
      "provider": "openai",
      "models": [
        {
          "model": "gpt-4o",
          "title": "GPT-4o",
          "baseURL": "https://api.openai.com/v1",
          "apiKey": "${OPENAI_API_KEY}"
        }
      ]
    }
  ]
}
```

**Node.js Code** to load with env var substitution:

```javascript
// scripts/load-config.js
const fs = require('fs');
const path = require('path');

function loadConfigWithEnv(configPath) {
  let config = fs.readFileSync(configPath, 'utf-8');

  // Replace ${VAR} with environment variables
  config = config.replace(/\$\{([^}]+)\}/g, (match, varName) => {
    return process.env[varName] || match;
  });

  return JSON.parse(config);
}

module.exports = { loadConfigWithEnv };
```

### Option 3: Secrets Manager Integration

Use dedicated secrets management for production:

```bash
# Load secrets from 1Password, Vault, AWS Secrets Manager, etc.
export OPENAI_API_KEY=$(get-secret openai-api-key)
export ANTHROPIC_API_KEY=$(get-secret anthropic-api-key)

npm run start:prod
```

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod

# Copy built code
COPY dist ./dist

# Copy data examples (users will mount their own config)
COPY data/*.example.json ./data/

# Create data directory for user configurations
RUN mkdir -p /app/data

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

EXPOSE 3000

CMD ["node", "dist/src/mcp-server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  code-intelligence:
    build: .
    container_name: code-intelligence-mcp
    ports:
      - '3000:3000'
    volumes:
      # Mount user's configuration
      - ./data/config.json:/app/data/config.json:ro
      - ./data/components.json:/app/data/components.json:ro
      - ./data/utils.json:/app/data/utils.json:ro
    environment:
      NODE_ENV: production
      GAREN_MCP_CONFIG: /app/data/config.json
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3000/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s
```

### Run Docker

```bash
# Build image
docker build -t code-intelligence-mcp .

# Run container
docker run -d \
  --name code-intelligence \
  -p 3000:3000 \
  -v $(pwd)/data/config.json:/app/data/config.json:ro \
  -v $(pwd)/data/components.json:/app/data/components.json:ro \
  -v $(pwd)/data/utils.json:/app/data/utils.json:ro \
  code-intelligence-mcp

# Or use docker-compose
docker-compose up -d
```

## Cloud Deployment

### AWS EC2

```bash
# SSH into instance
ssh -i key.pem ec2-user@your-instance-ip

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Clone repository
git clone https://github.com/lyw405/code-intelligence-mcp.git
cd code-intelligence-mcp

# Install dependencies
npm install -g pnpm
pnpm install

# Build
pnpm build

# Configure (secure configuration management)
export GAREN_MCP_CONFIG=/etc/code-intelligence/config.json
npm run start:prod
```

### AWS Lambda

```typescript
// handler.ts
import { CodeIntelligenceMCPServer } from 'code-intelligence-mcp';

export const handler = async (event: any) => {
  const server = new CodeIntelligenceMCPServer();
  // Configure from environment variables
  return await server.handleRequest(event);
};
```

### Google Cloud Run

```bash
# Deploy from GitHub
gcloud run deploy code-intelligence-mcp \
  --source github \
  --repo lyw405/code-intelligence-mcp \
  --region us-central1 \
  --set-env-vars GAREN_MCP_CONFIG=/etc/config/config.json \
  --allow-unauthenticated
```

### Azure App Service

```bash
# Deploy using Azure CLI
az webapp up \
  --name code-intelligence-mcp \
  --resource-group myResourceGroup \
  --runtime "node|18" \
  --runtime-version 18.0
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, production]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - run: pnpm install

      - run: npm run build

      - run: npm run check-all

      # Create runtime configuration from secrets
      - name: Create config.json
        run: |
          mkdir -p data
          cat > data/config.json << 'EOF'
          {
            "defaultModel": "${{ secrets.DEFAULT_MODEL }}",
            "providers": [...]
          }
          EOF

      - name: Deploy
        run: |
          # Deploy logic (Docker, serverless, etc.)
          npm run start:prod
```

### GitLab CI/CD

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - npm install
    - npm run build

test:
  stage: test
  script:
    - npm run check-all

deploy:
  stage: deploy
  script:
    - npm run start:prod
  only:
    - main
```

## Configuration Management Best Practices

### 1. **Separate Secrets from Code**

✅ Good:

```
├── data/
│   ├── config.json           # .gitignore'd
│   └── config.example.json   # Committed
└── .gitignore                # Excludes config.json
```

❌ Bad:

```
├── config.json               # Contains API keys, committed to git
```

### 2. **Use Environment Variables for Secrets**

✅ Good:

```bash
export OPENAI_API_KEY=sk-...
npm run start:prod
```

### 3. **Document Configuration Requirements**

Create `data/config.schema.json` for validation:

```json
{
  "type": "object",
  "required": ["defaultModel", "providers"],
  "properties": {
    "defaultModel": {
      "type": "string",
      "description": "Default AI model to use"
    },
    "providers": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["provider", "models"]
      }
    }
  }
}
```

### 4. **Validate Configuration on Startup**

```typescript
// src/config/validator.ts
import Ajv from 'ajv';
import schema from './config.schema.json';

const ajv = new Ajv();
const validate = ajv.compile(schema);

export function validateConfig(config: any) {
  const valid = validate(config);
  if (!valid) {
    throw new Error(`Invalid config: ${JSON.stringify(validate.errors)}`);
  }
}
```

## Monitoring and Logging

### Application Logs

```bash
# View logs
npm run dev 2>&1 | tee app.log

# With log rotation
npm run dev 2>&1 | rotatelogs /var/log/code-intelligence/app.log 10M
```

### Docker Logs

```bash
docker logs code-intelligence-mcp
docker logs -f code-intelligence-mcp  # Follow logs
```

## Troubleshooting

### Configuration File Not Found

```bash
# Verify file exists
ls -la data/config.json

# Check environment variable
echo $GAREN_MCP_CONFIG

# Check current working directory
pwd
```

### API Key Issues

```bash
# Verify API key is set
echo $OPENAI_API_KEY

# Test API connectivity
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti :3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

## Support

For deployment issues: https://github.com/lyw405/code-intelligence-mcp/issues
