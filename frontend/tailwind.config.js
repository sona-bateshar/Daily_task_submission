/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // scan React components
  ],
  // Configure dark mode to use the 'class' strategy
  darkMode: ["class"], 
  theme: {
    extend: {
      colors: {
        // Core Colors - Referencing CSS variables directly
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)", // Assuming a foreground for destructive
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        
        // Chart Colors (if you use them)
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },

        // Sidebar Colors (if you use them)
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: {
            DEFAULT: "var(--sidebar-primary)",
            foreground: "var(--sidebar-primary-foreground)",
          },
          accent: {
            DEFAULT: "var(--sidebar-accent)",
            foreground: "var(--sidebar-accent-foreground)",
          },
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      borderRadius: {
        lg: "var(--radius)", // Reference the CSS variable for radius
        md: "calc(var(--radius) - 2px)", // Common pattern for slightly smaller radius
        sm: "calc(var(--radius) - 4px)", // Common pattern for even smaller radius
      },
      // Keep your existing font families
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        heading: ["Poppins", "ui-sans-serif", "system-ui"],
      },
      // Keep your existing font sizes
      fontSize: {
        base: "16px",
        lg: "18px",
        xl: "24px",
        title: "32px",
        subtitle: "20px",
      },
      // Keep your existing spacing
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
      // Keep your existing box shadows
      boxShadow: {
        card: "0 4px 14px rgba(0,0,0,0.1)",
        input: "0 1px 3px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};


// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,jsx,ts,tsx}", // scan React components
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: {
//           light: "#3b82f6",   // lighter than #2563eb
//           DEFAULT: "#2563eb", // original blue-600
//           dark: "#1e40af",    // blue-800
//         },
//         secondary: {
//           light: "#fbbf24",   // lighter than #f59e0b
//           DEFAULT: "#f59e0b", // amber-500
//           dark: "#b45309",    // amber-700
//         },
//         background: {
//           light: "#ffffff",   // white
//           DEFAULT: "#f9fafb", // gray-50
//           dark: "#e5e7eb",    // gray-200
//         },
//         surface: {
//           DEFAULT: "#ffffff",
//           dark: "#f3f4f6",    // light gray
//         },
//         text: {
//           light: "#6b7280",   // gray-500
//           DEFAULT: "#1f2937", // gray-800
//           dark: "#111827",    // gray-900
//         },
//         muted: {
//           light: "#d1d5db",   // gray-300
//           DEFAULT: "#6b7280", // gray-500
//           dark: "#374151",    // gray-700
//         },
//         danger: {
//           light: "#f87171",   // red-400
//           DEFAULT: "#ef4444", // red-500
//           dark: "#b91c1c",    // red-700
//         },
//         success: {
//           light: "#34d399",   // green-400
//           DEFAULT: "#10b981", // green-500
//           dark: "#047857",    // green-700
//         },
//       },
//       fontFamily: {
//         sans: ["Inter", "ui-sans-serif", "system-ui"],
//         heading: ["Poppins", "ui-sans-serif", "system-ui"],
//       },
//       fontSize: {
//         base: "16px",
//         lg: "18px",
//         xl: "24px",
//         title: "32px",
//         subtitle: "20px",
//       },
//       spacing: {
//         72: "18rem",
//         84: "21rem",
//         96: "24rem",
//       },
//       borderRadius: {
//         lg: "0.5rem",
//         xl: "1rem",
//         "2xl": "1.5rem",
//       },
//       boxShadow: {
//         card: "0 4px 14px rgba(0,0,0,0.1)",
//         input: "0 1px 3px rgba(0,0,0,0.08)",
//       },
//     },
//   },
//   plugins: [],
// };
