import { NextResponse } from "next/server";
import connectDB from "@/utils/database";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { setAuthCookie } from "@/utils/cookies";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Please provide all required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = user.getSignedJwtToken();

    const response = NextResponse.json(
      {
        success: true,
        user: {
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    );

    setAuthCookie(token);

    return response;
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        message: "An error occurred while registering",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
