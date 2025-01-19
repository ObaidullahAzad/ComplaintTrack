import mongoose from "mongoose";

declare global {
  var mongoose:
    | {
        conn: any | null;
        promise: Promise<any> | null;
      }
    | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

async function connectDB() {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      cached.promise = mongoose
        .connect(MONGODB_URI!)
        .then((mongoose) => {
          console.log("Connected to MongoDB");
          return mongoose;
        })
        .catch((error) => {
          console.error("MongoDB connection error:", error);
          throw error;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

export default connectDB;
