import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      {/* Hero Section */}
      <div className="flex flex-1 items-center justify-center bg-black text-white px-6 lg:px-8">
        <div className="max-w-4xl text-center space-y-6">
          <h1 className="text-4xl lg:text-6xl font-bold">
            Welcome to OpenFund
          </h1>
          <p className="text-lg lg:text-xl">
            OpenFund is a platform dedicated to bringing transparency to
            donations. We empower users to track and verify how their
            contributions are making an impact, ensuring trust and accountability
            in every step of the process.
          </p>
          <p className="text-lg lg:text-xl">
            Join us in creating a world where every donation counts and every
            donor can see the difference they make.
          </p>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-white py-8 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl lg:text-3xl font-bold">
            Ready to make a difference?
          </h2>
          <p className="text-lg">
            Sign up today and start your journey towards transparent and impactful
            giving.
          </p>
          <div>
            <a
              href="/sign-in"
              className="inline-block bg-black text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-gray-800"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}