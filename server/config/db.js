const mongoose = require('mongoose');

let retryTimer = null;

const connectDB = async (retry = true) => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in environment variables. Please check your .env file.');
    if (!retry) process.exit(1);
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
    return conn;
  } catch (error) {
    console.error(`⚠️  MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('ECONNREFUSED')) {
      console.warn('💡 Tip: Your local MongoDB service is stopped. Start it via:');
      console.warn('   PowerShell/CMD (Admin): net start MongoDB');
      console.warn('   OR Windows Services: services.msc -> MongoDB Server -> Start');
    }

    if (retry) {
      console.log('🔄 Will retry connecting to MongoDB in 5 seconds...');
      if (!retryTimer) {
        retryTimer = setTimeout(() => {
          retryTimer = null;
          connectDB(true);
        }, 5000);
      }
    } else {
      throw error;
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB connection lost. Reconnecting...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB connection restored.');
});

module.exports = connectDB;

