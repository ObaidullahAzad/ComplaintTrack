import { NextResponse } from "next/server";
import connectDB from "@/utils/database";
import Complaint from "@/models/Complaint";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as {
      id: string;
    };

    const { title, description, category, priority } = await req.json();

    await connectDB();

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      user: decoded.id,
    });

    return NextResponse.json({ success: true, complaint }, { status: 201 });
  } catch (error: any) {
    console.error("Complaint creation error:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the complaint" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as {
      id: string;
    };

    await connectDB();

    const complaints = await Complaint.find({ user: decoded.id }).sort({
      createdAt: -1,
    }); // Sort by newest first

    return NextResponse.json({ success: true, complaints });
  } catch (error: any) {
    console.error("Fetch complaints error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching complaints" },
      { status: 500 }
    );
  }
}
