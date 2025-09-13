"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
  variant?: "secondary" | "ghost";
  children?: React.ReactNode;
}

export const LogoutButton = ({
  variant = "secondary",
  children = "Logout",
}: LogoutButtonProps) => {
  const onClick = () => {
    window.location.href = "/logout";
  };

  return (
    <Button variant={variant} onClick={onClick}>
      {children}
    </Button>
  );
};

// Export the onClick function separately if needed
export const onLogoutClick = () => {
  if (typeof window !== "undefined") {
    window.location.href = "/logout";
  }
};

export default LogoutButton;
