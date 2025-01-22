"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterBtn() {
  const { user } = useAuth();

  return (
    <div className="text-white text-xl m-5 font-semibold ">
      {user ? (
        <Link href="/raise-complaint">
          <button className="bg-slate-600 p-4 rounded-xl shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] hover:bg-slate-500">
            Complain
          </button>
        </Link>
      ) : (
        <Link href="/signup">
          <button className="bg-slate-600 p-4 rounded-xl shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] hover:bg-slate-500">
            Register
          </button>
        </Link>
      )}
    </div>
  );
}
