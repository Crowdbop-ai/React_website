import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const CrowdbopBanner = () => {
  const crowdBopOrange = "#E16C4C";
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");

  // Check session storage on component mount and update state
  const handleAuthClick = () => {
    if (isLoggedIn) {
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("showLoginModal");
      setIsLoggedIn(false);
      setUserId("");
      navigate("/");
    } else {
      sessionStorage.setItem("showLoginModal", "true");
      navigate("/");
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const userId = sessionStorage.getItem("userId");
      setIsLoggedIn(!!userId);
      setUserId(userId || "");
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange(); // Run on load

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Navbar
      expand="lg"
      style={{
        backgroundColor: crowdBopOrange,
        fontFamily: "'Archivo Black', sans-serif",
      }}
      className="shadow-sm"
    >
      <Container fluid>
        <Navbar.Brand
          href="/"
          className="me-5"
          style={{
            fontSize: "23px",
            letterSpacing: "0.5px",
            color: location.pathname === "/" ? "black" : "white",
          }}
        >
          CrowdBop
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              href="/voting"
              className="px-4"
              style={{
                color: location.pathname === "/voting" ? "black" : "white",
              }}
            >
              Voting
            </Nav.Link>
            <Nav.Link
              href="/rankings"
              className="px-4"
              style={{
                color: location.pathname === "/rankings" ? "black" : "white",
              }}
            >
              Rankings
            </Nav.Link>
            <Nav.Link
              href="/liked"
              className="px-4"
              style={{
                color: location.pathname === "/liked" ? "black" : "white",
              }}
            >
              Liked List
            </Nav.Link>
            <Nav.Link
              href="/recommended"
              className="px-4"
              style={{
                color: location.pathname === "/recommended" ? "black" : "white",
              }}
            >
              Recommended Items
            </Nav.Link>
          </Nav>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "auto",
            }}
          >
            {userId && (
              <span
                style={{
                  marginRight: "15px",
                  color: "white",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                }}
              >
                UserID: {userId}
              </span>
            )}
            <Button
              // variant={isLoggedIn ? "dark" : "light"}
              variant="light"
              onClick={handleAuthClick}
              style={{
                fontFamily: "'Archivo Black', sans-serif",
              }}
            >
              {isLoggedIn ? "Logout" : "Login"}
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CrowdbopBanner;
