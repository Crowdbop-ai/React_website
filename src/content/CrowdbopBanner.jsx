import React from "react";

const CrowdbopBanner = () => {
  // The orange color from your design
  const crowdBopOrange = "#E16C4C";

  return (
    <nav
      className="w-full shadow-md"
      style={{ backgroundColor: crowdBopOrange }}
    >
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left side with logo and navigation */}
          <div className="flex items-center">
            {/* Logo and site name */}
            <a href="/" className="flex items-center mr-8">
              <span
                className="text-xl text-white font-sans"
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontSize: "23px",
                  letterSpacing: "0.5px",
                }}
              >
                CrowdBop
              </span>
            </a>

            {/* Navigation Links - now next to logo */}
            <a
              href="/voting"
              className="px-5 py-2 text-white font-sans"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Voting
            </a>

            <a
              href="/rankings"
              className="px-4 py-2 text-white font-sans"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Rankings
            </a>

            <a
              href="/liked"
              className="px-4 py-2 text-white font-sans"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Liked List
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CrowdbopBanner;
