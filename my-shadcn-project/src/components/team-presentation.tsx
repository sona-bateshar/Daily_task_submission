import React from "react";



export function const SvgDynamicColor = ({ color = '#3498db' }) => {
  // A placeholder SVG string. You will replace this with your full SVG content.
  // This example includes both solid fills and a linear gradient to show how to handle both.
  const svgString = `
    <svg id="dynamic-svg-placeholder" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
      <defs>
        <style>
          .cls-2_team-presentation-5-87 { fill: #68e1fd; opacity: 0.18; }
          .cls-24_team-presentation-5-87 { fill: #68e1fd; }
          .cls-25_team-presentation-5-87 { fill: none; stroke: #68e1fd; stroke-miterlimit: 10; }
        </style>
        <linearGradient id="linear-gradient-dynamic" x1="0" y1="0" x2="500" y2="500" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#68e1fd"/>
          <stop offset="1" stop-color="#2c6999"/>
        </linearGradient>
      </defs>
      <path class="cls-2_team-presentation-5-87" d="M100,100 L400,100 L400,400 L100,400 Z" />
      <circle class="cls-24_team-presentation-5-87" cx="250" cy="250" r="100" />
      <rect x="50" y="50" width="100" height="100" fill="url(#linear-gradient-dynamic)" />
      <path class="cls-25_team-presentation-5-87" d="M250,50 L250,450" />
    </svg>
  `;


  const [dynamicSvg, setDynamicSvg] = svgString;
  const newSvg = svgString
      // Replace solid fills in inline styles and class definitions
      .replace(/fill: #68e1fd;/gi, `fill: ${color};`)
      // Replace stroke colors
      .replace(/stroke: #68e1fd;/gi, `stroke: ${color};`)
      // Replace colors within gradient definitions
      .replace(/stop-color="#68e1fd"/gi, `stop-color="${color}"`);
      
    // setDynamicSvg(newSvg);

  

//   useEffect(() => {
//     // This is the core logic. We use a regular expression to find and replace
//     // all occurrences of the target color with the new color.
//     // The 'g' flag ensures all instances are replaced.
//     // The 'i' flag makes the search case-insensitive.
//     // We are replacing both the hex code and the URL reference to the gradient.
//     const newSvg = svgString
//       // Replace solid fills in inline styles and class definitions
//       .replace(/fill: #68e1fd;/gi, `fill: ${color};`)
//       // Replace stroke colors
//       .replace(/stroke: #68e1fd;/gi, `stroke: ${color};`)
//       // Replace colors within gradient definitions
//       .replace(/stop-color="#68e1fd"/gi, `stop-color="${color}"`);
      
//     setDynamicSvg(newSvg);
//   }, [color]);

  // IMPORTANT SECURITY NOTE: Using dangerouslySetInnerHTML is necessary to render
  // the SVG string. This is a powerful but potentially dangerous feature.
  // Ensure that the SVG source is trusted and sanitized to prevent XSS attacks.
  
  return (
    <div
    >
      <div
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: newSvg }}
      />
    </div>
  );
};


