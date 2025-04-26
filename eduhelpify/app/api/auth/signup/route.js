import { NextResponse } from "next/server";
// Import your database connection and User model
// import { connectToDB } from "@/lib/db";
// import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Uncomment and connect to the DB
    // await connectToDB();

    // Check if user already exists in the database
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   return NextResponse.json(
    //     { message: "User already exists with this email" },
    //     { status: 409 }
    //   );
    // }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user in DB (mocked here)
    const newUser = {
      id: Math.random().toString(36).substr(2, 9), // Temporary mock ID
      name,
      email,
      password: hashedPassword,
    };

    // Save new user to DB (mocked here)
    // await User.create(newUser);

    console.log("User creation response:", newUser);

    return NextResponse.json(
      { 
        success: true,
        message: "User created successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
