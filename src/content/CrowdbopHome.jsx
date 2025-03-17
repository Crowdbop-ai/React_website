import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";

const CrowdbopHome = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const navigate = useNavigate();


  // Trigger animations after component mount
  useEffect(() => {
    setTimeout(() => setIsAnimated(true), 100);
  }, []);

  // Handle navigation (would use Link in your actual app)
  const handleStartVoting = () => {
    alert("This would navigate to voting in your actual app");
    // In your real code, use: navigate('/voting') or history.push('/voting')
  };



  return (
    <div
      className="crowdbop-container"
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "'Archivo Black', sans-serif",
      }}
    >
      {/* Header Section */}
      <div
        className="header-section"
        style={{
          textAlign: "center",
          marginBottom: "60px",
          opacity: isAnimated ? 1 : 0,
          transform: isAnimated ? "translateY(0)" : "translateY(-20px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <h1
          style={{
            fontSize: "3.5rem",
            marginBottom: "20px",
            color: "#333",
          }}
        >
          Welcome to <span style={{ color: "#E85C41" }}>CrowdBop</span>
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            maxWidth: "700px",
            margin: "0 auto 40px",
            lineHeight: "1.6",
            color: "#555",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Help us discover the most popular items by voting on your favorites!
          Your opinions shape our collection.
        </p>

        {/* Custom Button */}
         {/* Buttons Container (Stacked Vertically) */}
         <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px", // Spacing between buttons
            marginTop: "30px",
          }}
        >
          <button
            onClick={() => navigate("/voting")}
            className="voting-button"
            style={{
              position: "relative",
              backgroundColor: "#fff",
              color: "#E85C41",
              border: "2px solid #E85C41",
              borderRadius: "50px",
              padding: "15px 40px",
              fontSize: "1.3rem",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              boxShadow: "0 4px 14px rgba(232, 92, 65, 0.2)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#E85C41";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(232, 92, 65, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#fff";
              e.currentTarget.style.color = "#E85C41";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 14px rgba(232, 92, 65, 0.2)";
            }}
          >
            Start Voting Now
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                marginLeft: "10px",
                animation: "arrowBounce 1s infinite",
              }}
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          <button
            onClick={() => navigate("/liked")}
            className="voting-button"
            style={{
              position: "relative",
              backgroundColor: "#fff",
              color: "#E85C41",
              border: "2px solid #E85C41",
              borderRadius: "50px",
              padding: "15px 40px",
              fontSize: "1.3rem",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              boxShadow: "0 4px 14px rgba(232, 92, 65, 0.2)",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#E85C41";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(232, 92, 65, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#fff";
              e.currentTarget.style.color = "#E85C41";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 14px rgba(232, 92, 65, 0.2)";
            }}
          >
            View Liked Items
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                marginLeft: "10px",
                animation: "arrowBounce 1s infinite",
              }}
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>

      {/* How It Works Section */}
      <div
        className="how-it-works-section"
        style={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
          opacity: isAnimated ? 1 : 0,
          transform: isAnimated ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#333",
            position: "relative",
            paddingBottom: "10px",
          }}
        >
          How It Works
          <div
            style={{
              content: '""',
              position: "absolute",
              bottom: "0",
              left: "50%",
              transform: "translateX(-50%)",
              width: "80px",
              height: "3px",
              backgroundColor: "#E85C41",
            }}
          ></div>
        </h2>

        <div
          className="steps-container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            margin: "0 auto",
          }}
        >
          {/* Step 1 */}
          <div
            className="step-card"
            style={{
              padding: "20px",
              backgroundColor: "#fafafa",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "default",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 15px rgba(0,0,0,0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#E85C41",
                  color: "#fff",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                1
              </div>
              <h3
                style={{
                  margin: "0",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Vote on Pairs
              </h3>
            </div>
            <p
              style={{
                margin: "0",
                color: "#666",
                fontFamily: "Arial, sans-serif",
                fontSize: "0.95rem",
                lineHeight: "1.5",
              }}
            >
              Choose between pairs of products from ShopBop's catalog
            </p>
          </div>

          {/* Step 2 */}
          <div
            className="step-card"
            style={{
              padding: "20px",
              backgroundColor: "#fafafa",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "default",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 15px rgba(0,0,0,0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#E85C41",
                  color: "#fff",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                2
              </div>
              <h3
                style={{
                  margin: "0",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Track Popularity
              </h3>
            </div>
            <p
              style={{
                margin: "0",
                color: "#666",
                fontFamily: "Arial, sans-serif",
                fontSize: "0.95rem",
                lineHeight: "1.5",
              }}
            >
              Each vote helps us determine which products are most popular
            </p>
          </div>

          {/* Step 3 */}
          <div
            className="step-card"
            style={{
              padding: "20px",
              backgroundColor: "#fafafa",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "default",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 15px rgba(0,0,0,0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#E85C41",
                  color: "#fff",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                3
              </div>
              <h3
                style={{
                  margin: "0",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                View Trends
              </h3>
            </div>
            <p
              style={{
                margin: "0",
                color: "#666",
                fontFamily: "Arial, sans-serif",
                fontSize: "0.95rem",
                lineHeight: "1.5",
              }}
            >
              See rankings to discover which items are trending
            </p>
          </div>

          {/* Step 4 */}
          <div
            className="step-card"
            style={{
              padding: "20px",
              backgroundColor: "#fafafa",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "default",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 15px rgba(0,0,0,0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#E85C41",
                  color: "#fff",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                4
              </div>
              <h3
                style={{
                  margin: "0",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Discover New Items
              </h3>
            </div>
            <p
              style={{
                margin: "0",
                color: "#666",
                fontFamily: "Arial, sans-serif",
                fontSize: "0.95rem",
                lineHeight: "1.5",
              }}
            >
              Find new favorites you might have missed
            </p>
          </div>
        </div>
      </div>

      {/* Optional: Background decoration */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          pointerEvents: "none",
          opacity: 0.05,
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              backgroundColor: "#E85C41",
              borderRadius: "50%",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Animation keyframes */}
      <style>
        {`
          @keyframes arrowBounce {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(5px); }
          }
        `}
      </style>
    </div>
  );
};

export default CrowdbopHome;
