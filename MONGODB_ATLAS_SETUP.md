# MongoDB Atlas Setup Guide for NOAH Application

This guide explains how to configure MongoDB Atlas for the NOAH application, replacing the local MongoDB installation.

## Prerequisites

1. MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)
2. Node.js and npm installed

## Setting up MongoDB Atlas

### 1. Create a MongoDB Atlas Account
- Go to https://www.mongodb.com/cloud/atlas/register
- Sign up for a free account
- Create a new project (or use the default one)

### 2. Create a Cluster
- Click "Build a Cluster"
- Select the free tier (M0 Sandbox) if you're just testing
- Choose a cloud provider and region closest to you
- Click "Create Cluster" (this may take a few minutes)

### 3. Configure Database Access
- In the left sidebar, go to "Database Access" under Security
- Click "Add New Database User"
- Enter a username and password (remember these!)
- For user privileges, select "Atlas Admin"
- Click "Add User"

### 4. Configure Network Access
- In the left sidebar, go to "Network Access" under Security
- Click "Add IP Address"
- For development, you can add your current IP or "Allow Access from Anywhere" (0.0.0.0/0)
- Note: For production, restrict to specific IPs only
- Click "Confirm"

### 5. Get Your Connection String
- Go back to your cluster overview
- Click "Connect"
- Select "Connect your application"
- Copy the connection string

## Configuring the Application

### 1. Update .env.local
Replace the placeholders in your [.env.local](file:///D:/Data%20C/Downloads/NOAH/noah/.env.local) file with your actual MongoDB Atlas credentials:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

Example:
```
MONGODB_URI=mongodb+srv://myUser:myPassword@cluster0.abc123.mongodb.net/noah?retryWrites=true&w=majority
```

### 2. Test the Connection
Run the test script to verify your connection:
```bash
node test-db-connection.js
```

## Benefits of Using MongoDB Atlas

1. **No Local Installation Required**: Eliminates the need to install and maintain MongoDB locally
2. **Cloud Accessibility**: Access your database from anywhere
3. **Automatic Backups**: Built-in backup and recovery options
4. **Scalability**: Easy to scale as your application grows
5. **Monitoring**: Built-in performance monitoring and alerts
6. **Security**: Enterprise-grade security features

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Double-check your username and password
   - Ensure the user has been added to your Atlas cluster
   
2. **Network Access Issues**
   - Make sure your IP address is whitelisted in Network Access settings
   - For development, you can temporarily allow access from anywhere (0.0.0.0/0)
   
3. **Connection Timeout**
   - Check your internet connection
   - Ensure your firewall isn't blocking the connection

### Testing Your Setup

Run the provided test scripts to verify everything works:
```bash
# Test database connection
node test-db-connection.js

# Test API connectivity
node test-api-connectivity.js
```

## Deployment Considerations

When deploying to platforms like Vercel, Netlify, or other cloud providers:

1. Set the MONGODB_URI environment variable in your deployment platform's settings
2. Never commit actual credentials to version control
3. Use environment variables for all sensitive information

## Need Help?

If you encounter any issues:
1. Check the MongoDB Atlas documentation: https://docs.atlas.mongodb.com/
2. Review the error messages in your console
3. Ensure all steps in this guide have been completed