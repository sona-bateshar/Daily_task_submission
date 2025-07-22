
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // scan React components
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",       // blue-600
        primaryDark: "#1e40af",   // blue-800
        secondary: "#f59e0b",     // amber-500
        background: "#f9fafb",    // gray-50
        surface: "#ffffff",       // white
        text: "#1f2937",          // gray-800
        muted: "#6b7280",         // gray-500
        danger: "#ef4444",        // red-500
        success: "#10b981",       // green-500
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        heading: ["Poppins", "ui-sans-serif", "system-ui"],
      },
      fontSize: {
        base: "16px",
        lg: "18px",
        xl: "24px",
        title: "32px",
        subtitle: "20px",
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        card: "0 4px 14px rgba(0,0,0,0.1)",
        input: "0 1px 3px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
