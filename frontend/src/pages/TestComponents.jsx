import React from "react";
import TextBlock from "../components/TextBlock";
// import Button from "../components/Button";

export default function testcomponents() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <img src="/logo.png" alt="Logo" className="w-24 h-24 mb-6" />

      <TextBlock
        heading="Welcome to ClaimCheck"
        description="Track and audit your reimbursements effortlessly."
        centered
      />

      {/* <Button text="Get Started" href="/login" /> */}
    </div>
  );
}
