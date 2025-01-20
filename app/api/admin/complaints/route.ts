import { NextResponse } from "next/server";
import connectDB from "@/utils/database";
import Complaint from "@/models/Complaint";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    const query: { status?: string; priority?: string } = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const complaints = await Complaint.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, complaints });
  } catch (error) {
    console.error("Admin complaints error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
