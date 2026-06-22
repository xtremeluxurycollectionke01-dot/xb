// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/UserModel/User";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const { email, password } = await request.json();

    console.log("Login attempt for:", email);

    // Find user with password field explicitly selected
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    
    if (!user) {
      console.log("User not found:", email);
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("User found, checking password...");

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log("Password match:", isMatch);
    
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create token with name included
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
          _id: user._id,  // Changed from 'id' to '_id' for consistency
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone || user.address?.phone || null,
        },
        token, // Include token in response body for client to use with Socket.IO
      },
      { status: 200 }
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
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}