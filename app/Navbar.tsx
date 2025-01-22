"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Navbar() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <nav className="bg-slate-900 text-white p-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-xl font-bold">
            Complaint Track
          </Link>
          {user && user.role !== "admin" && (
            <>
              <Link href="/raise-complaint" className="hover:text-gray-300">
                Raise a Complaint
              </Link>
              <Link href="/my-complaints" className="hover:text-gray-300">
                My Complaints
              </Link>
            </>
          )}
          {user?.role === "admin" && (
            <Link href="/admin/dashboard" className="hover:text-gray-300">
              Admin Dashboard
            </Link>
          )}
        </div>
        <div className="space-x-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      {user.name}
                    </div>
                    <div className="px-4 py-2 text-sm text-gray-500">
                      {user.email}
                    </div>
                    <hr />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-300 font-semibold">
                Login
              </Link>
              <Link
                href="/signup"
                className="hover:text-gray-300 font-semibold"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
