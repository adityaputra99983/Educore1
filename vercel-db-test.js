// Test script specifically for Vercel deployment
require('dotenv').config({ path: '.env.local' });

console.log('=== Vercel Database Connection Test ===');
console.log('Current working directory:', process.cwd());
console.log('Environment variables loaded:');
console.log('- MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('- MONGODB_URI length:', process.env.MONGODB_URI?.length || 0);

if (process.env.MONGODB_URI) {
    // Mask the credentials for security
    const maskedUri = process.env.MONGODB_URI.replace(/\/\/(.*?):(.*?)@/, '//****:****@');
    console.log('- MONGODB_URI (masked):', maskedUri);
}

console.log('\n=== Environment Check ===');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('VERCEL_ENV:', process.env.VERCEL_ENV || 'not set');

console.log('\n=== Next.js Specific Environment Variables ===');
Object.keys(process.env)
    .filter(key => key.startsWith('NEXT_PUBLIC_') || key.startsWith('MONGODB_'))
    .forEach(key => {
        if (key.includes('SECRET') || key.includes('KEY') || key.includes('PASSWORD')) {
            console.log(`${key}: **** (hidden for security)`);
        } else {
            console.log(`${key}: ${process.env[key]}`);
        }
    });

console.log('\n=== Test Completed ===');