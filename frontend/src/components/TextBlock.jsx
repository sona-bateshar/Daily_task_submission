import React from "react";

export default function TextBlock({ heading, description, centered = false }) {
  return (
    <div className={`my-6 ${centered ? "text-center" : "text-left"}`}>
      <h2 className="text-title font-heading text-primary mb-2">
        {heading}
      </h2>
      <p className="text-muted font-sans text-base">
        {description}
      </p>
    </div>
  );
}
