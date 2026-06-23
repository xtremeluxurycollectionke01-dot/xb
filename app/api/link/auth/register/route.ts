// app/api/auth/register/route.ts
/*import { NextResponse } from "next/server";
import {dbConnect } from "@/lib/mongodb";
import { signToken } from "@/lib/auth";
import User from "@/models/UserModel/User";


export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const { name, email, password, phone } = await request.json();

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 400 }
      );
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: "customer",
    });

    // Create token
    const token = await signToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
        token, // Include token in response
      },
      { status: 201 }
    );

    // Set cookie
    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}*/

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/mongodb";
import { signToken } from "@/lib/auth";
import User from "@/models/UserModel/User";

export async function POST(request: Request) {
  try {
    await dbConnect();

    console.log("🟢 DB CONNECTED");
    console.log("📦 DB Name:", mongoose.connection.name);
    console.log("🌐 Host:", mongoose.connection.host);
    console.log("🔌 Ready State:", mongoose.connection.readyState);

    console.log("🧠 User Model:", User.modelName);
    console.log("📁 Collection:", User.collection.name);
    console.log("📚 All Models:", Object.keys(mongoose.models));

    const { name, email, password, phone } = await request.json();

    console.log("📩 Incoming Data:", {
      name,
      email,
      phone,
      passwordLength: password?.length,
    });

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    console.log("🔍 Existing user found:", !!existingUser);

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 400 }
      );
    }

    console.log(
      "User Schema Paths:",
      Object.keys(User.schema.paths)
    );

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: "customer",
    });

    console.log("🎉 User created:", user._id);

    const token = await signToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
        token,
      },
      { status: 201 }
    );

    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("❌ Registration error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}