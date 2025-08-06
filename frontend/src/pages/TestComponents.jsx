import React from "react";
import TextBlock from "../components/TextBlock";
// import Button from "../components/Button";
import LinkText from '../components/LinkText';
// import InputField from '../components/InputField';
import { Button } from "../components/ui/button"



import Icon from "../icons/Icon";


export default function TestComponents() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      {/* <InputField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        error={errors.email}
      /> */}
      <Button>Button</Button>
      <Icon iconName="home" color="blue-400" size="120" className="mb-2" />
      <LinkText to="/about" text="About Us" />
      <LinkText to="https://example.com" text="Visit Site" external />
      <img src="/logo.png" alt="Logo" className="w-24 h-24 mb-6" />

      <TextBlock
        heading="Welcome to ClaimCheck"
        description="Track and audit your reimbursements effortlessly."
        centered
      />



      {/* <Button text="Go to Dashboard" to="/dashboard" /> */}
      
      
      <div className={`my-6 ${0 ? "text-center" : "text-left"}`}>
        <p className="text-muted font-sans text-base">
          {}
        </p>
      </div>

      <Button text="Logout" to="/logout" />

      {/* <Button text="Get Started" href="/login" /> */}
    </div>
  );
}
