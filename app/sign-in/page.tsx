import React from "react";
import Image from "next/image";
import AuthForm from "./components/auth-form";

export default function SignInPage() {
  return (
    <div className="flex h-screen">
      <div className="hidden lg:block lg:w-3/5 bg-black"></div>

      <div className="w-full lg:w-2/5 flex items-center justify-center min-h-screen px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="w-full">
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
}
