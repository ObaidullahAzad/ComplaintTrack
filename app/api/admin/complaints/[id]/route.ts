import { NextResponse } from "next/server";
import connectDB from "@/utils/database";
import Complaint from "@/models/Complaint";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify token and get user details
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };

    await connectDB();

    // Get user from database to double-check role
    const user = await User.findById(decoded.id);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const { status } = await req.json();

    const complaint = await Complaint.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, complaint });
  } catch (error: any) {
    console.error("Update complaint error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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
      role: string;
    };

    await connectDB();

    const user = await User.findById(decoded.id);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    const complaint = await Complaint.findByIdAndDelete(params.id);

    if (!complaint) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    console.error("Delete complaint error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}