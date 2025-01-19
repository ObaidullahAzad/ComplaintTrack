import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthenticatedRequest extends NextApiRequest {
  user?: any;
}

export async function protect(
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: () => void
) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = await User.findById((decoded as any).id);
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
}
