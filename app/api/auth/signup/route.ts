import { NextResponse } from "next/server";
import connectDB from "@/utils/database";
import User from "@/models/User";
// import { cookies } from "next/headers";

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

    // Create the response with role included
    const response = NextResponse.json(
      {
        success: true,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );

    // Set the cookie directly on the response
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        message: "An error occurred while registering",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
