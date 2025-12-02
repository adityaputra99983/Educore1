<<<<<<< HEAD
# Vercel Deployment Troubleshooting Guide

This guide addresses common issues when deploying the NOAH application to Vercel, particularly focusing on MongoDB connection problems.

## Common MongoDB Connection Issues

### 1. Environment Variables Not Set
**Problem**: MongoDB connection fails because environment variables aren't configured in Vercel.

**Solution**:
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add the following variable:
   - Name: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

### 2. IP Whitelist Restrictions
**Problem**: MongoDB Atlas rejects connections from Vercel due to IP restrictions.

**Solution**:
1. Log in to your MongoDB Atlas account
2. Go to Network Access under Security
3. Either:
   - Add Vercel's IP ranges to your whitelist
   - Or temporarily set the whitelist to `0.0.0.0/0` for testing (not recommended for production)

### 3. Connection Timeouts
**Problem**: Connections time out when trying to reach MongoDB Atlas from Vercel.

**Solution**:
The application is already configured with appropriate timeouts:
- `serverSelectionTimeoutMS: 5000`
- `socketTimeoutMS: 45000`

These should handle most network conditions.

## Testing Your Configuration

### 1. Local Testing
Before deploying, test your configuration locally:

```bash
# Run the database connection test
node test-db-connection.js

# Check if the health check API works
npm run dev
# Then visit http://localhost:3000/api/health-check
```

### 2. Vercel Testing
After deployment:

1. Visit your deployed site's health check endpoint:
   `https://your-app.vercel.app/api/health-check`

2. Check the Vercel logs for any error messages:
   - Go to your Vercel dashboard
   - Select your deployment
   - Check the Functions tab for error logs

## Environment Variable Best Practices

### For Development (.env.local):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### For Production (Vercel Environment Variables):
1. Use the same format as above
2. Store sensitive information in Vercel's environment variables, not in code
3. Never commit actual credentials to version control

## Common Error Messages and Solutions

### "Missing Credentials"
**Cause**: Username or password missing from connection string
**Solution**: Ensure your connection string includes valid credentials

### "Invalid scheme, expected connection string to start with 'mongodb://' or 'mongodb+srv://'"
**Cause**: Malformed connection string
**Solution**: Check that your connection string starts with `mongodb+srv://`

### "Server selection timed out"
**Cause**: Network connectivity issues or IP restrictions
**Solution**: 
1. Check your MongoDB Atlas IP whitelist
2. Verify your connection string is correct
3. Test connectivity from your local machine

## Vercel Configuration

The project includes a `vercel.json` file with the proper configuration. No additional changes should be needed.

## Need Help?

If you continue to experience issues:

1. Check the Vercel deployment logs
2. Verify your MongoDB Atlas cluster is active and accessible
3. Test your connection string with MongoDB Compass or another MongoDB client
4. Ensure your MongoDB user has appropriate permissions

=======
# Vercel Deployment Troubleshooting Guide

This guide addresses common issues when deploying the NOAH application to Vercel, particularly focusing on MongoDB connection problems.

## Common MongoDB Connection Issues

### 1. Environment Variables Not Set
**Problem**: MongoDB connection fails because environment variables aren't configured in Vercel.

**Solution**:
1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add the following variable:
   - Name: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

### 2. IP Whitelist Restrictions
**Problem**: MongoDB Atlas rejects connections from Vercel due to IP restrictions.

**Solution**:
1. Log in to your MongoDB Atlas account
2. Go to Network Access under Security
3. Either:
   - Add Vercel's IP ranges to your whitelist
   - Or temporarily set the whitelist to `0.0.0.0/0` for testing (not recommended for production)

### 3. Connection Timeouts
**Problem**: Connections time out when trying to reach MongoDB Atlas from Vercel.

**Solution**:
The application is already configured with appropriate timeouts:
- `serverSelectionTimeoutMS: 5000`
- `socketTimeoutMS: 45000`

These should handle most network conditions.

## Testing Your Configuration

### 1. Local Testing
Before deploying, test your configuration locally:

```bash
# Run the database connection test
node test-db-connection.js

# Check if the health check API works
npm run dev
# Then visit http://localhost:3000/api/health-check
```

### 2. Vercel Testing
After deployment:

1. Visit your deployed site's health check endpoint:
   `https://your-app.vercel.app/api/health-check`

2. Check the Vercel logs for any error messages:
   - Go to your Vercel dashboard
   - Select your deployment
   - Check the Functions tab for error logs

## Environment Variable Best Practices

### For Development (.env.local):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### For Production (Vercel Environment Variables):
1. Use the same format as above
2. Store sensitive information in Vercel's environment variables, not in code
3. Never commit actual credentials to version control

## Common Error Messages and Solutions

### "Missing Credentials"
**Cause**: Username or password missing from connection string
**Solution**: Ensure your connection string includes valid credentials

### "Invalid scheme, expected connection string to start with 'mongodb://' or 'mongodb+srv://'"
**Cause**: Malformed connection string
**Solution**: Check that your connection string starts with `mongodb+srv://`

### "Server selection timed out"
**Cause**: Network connectivity issues or IP restrictions
**Solution**: 
1. Check your MongoDB Atlas IP whitelist
2. Verify your connection string is correct
3. Test connectivity from your local machine

## Vercel Configuration

The project includes a `vercel.json` file with the proper configuration. No additional changes should be needed.

## Need Help?

If you continue to experience issues:

1. Check the Vercel deployment logs
2. Verify your MongoDB Atlas cluster is active and accessible
3. Test your connection string with MongoDB Compass or another MongoDB client
4. Ensure your MongoDB user has appropriate permissions

>>>>>>> 6e4a954937fec25b661d78aabe9237d139f19a73
Contact the development team if you need assistance with the database connection configuration.