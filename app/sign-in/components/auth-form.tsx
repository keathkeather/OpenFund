"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check } from "lucide-react";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/app/firebase/config"; // Import Firebase auth instance

export default function AuthForm() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Password validation states
  const [isMinLength, setIsMinLength] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  // Handle password validation
  const handlePasswordChange = (value: string) => {
    setPassword(value);

    // Check if password meets the requirements
    setIsMinLength(value.length >= 8);
    setHasUppercase(/[A-Z]/.test(value));
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(value));
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      toast.success(`Welcome, ${user.displayName}!`);
      router.push("/home"); 
    } catch (error: any) {
      toast.error(error.message || "Google sign-in failed.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp && (!isMinLength || !hasUppercase || !hasSpecialChar)) {
      toast.error("Password does not meet the requirements.");
      return;
    }

    try {
      if (isSignUp) {
        toast.success("Sign up successful!");
        setIsSignUp(false); 
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        toast.success(`Welcome back, ${result.user?.email}!`);
        router.push("/home");
      }
    } catch (error: any) {
      // Handle Firebase Authentication errors
      switch (error.code) {
        case "auth/user-not-found":
          toast.error("No user found with this email.");
          break;
        case "auth/wrong-password":
          toast.error("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          toast.error("Invalid email format.");
          break;
        case "auth/too-many-requests":
          toast.error("Too many failed login attempts. Please try again later.");
          break;
        default:
          toast.error("Invalid Email/Password. Please try again.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">
          {isSignUp ? "Sign Up" : "Login"}
        </h1>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Password Validation Checklist */}
          {isSignUp && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 border rounded-sm mr-2 flex items-center justify-center ${
                    isMinLength
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300"
                  }`}
                >
                  {isMinLength && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm">At least 8 characters</span>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 border rounded-sm mr-2 flex items-center justify-center ${
                    hasUppercase
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300"
                  }`}
                >
                  {hasUppercase && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm">At least one uppercase letter</span>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 border rounded-sm mr-2 flex items-center justify-center ${
                    hasSpecialChar
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300"
                  }`}
                >
                  {hasSpecialChar && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm">At least one special character</span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          {isSignUp ? "Sign Up" : "Login"}
        </Button>

        {/* Google OAuth Button */}
        <Button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full bg-red-500 hover:bg-red-600 text-white"
        >
          Continue with Google
        </Button>

        {/* Toggle between Sign Up and Login */}
        <div className="text-center">
          <p className="text-sm">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-500 hover:underline"
            >
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
