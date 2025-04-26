import { NextResponse } from "next/server";
// import { connectToDB } from "@/lib/db";
// import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDB();

    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // If using NextAuth.js credentials provider, you can return success
    // The actual session creation will be handled by NextAuth
    return NextResponse.json(
      { 
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}