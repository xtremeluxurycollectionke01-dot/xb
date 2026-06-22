

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? (global.mongooseCache = {
  conn: null,
  promise: null,
});

export const dbConnect = async () => {
  // already connected
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // reset broken connection
  if (mongoose.connection.readyState === 0) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      family: 4, // 🔥 FIXES Atlas DNS / hostname mismatch issues
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null; // reset on failure
    throw err;
  }

  return cached.conn;
};
