import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Row, Col, Alert} from "react-bootstrap";

const CrowdbopHome = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [userId, setUserId] = useState(sessionStorage.getItem("userId") || ""); // Get userId from session storage if it exists
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [designers, setDesigners] = useState([]); // designerNames
  

  // Trigger animations after component mount
  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        // Correct path - assumes JSON is in public/assets
        const response = await fetch('src/assets/top_designers.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data) {
          throw new Error('No data received');
        }
        
        // // Extract just the values (designer names) from the object
        const designerNames = Object.values(data);
        setDesigners(designerNames);
      } catch (err) {
        console.error("Failed to fetch designers:", err);
        setError("Failed to load designer data. Please refresh the page.");
      }
    };

    fetchDesigners();

    if (!userId) {
      setShowModal(true);
    }
    setTimeout(() => setIsAnimated(true), 100);
  }, []);

  // if (isLoading) {
  //   return <div>Loading designers...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }  
  const colorOptions = [
    'Red', 'Pink', 'Orange', 'Yellow', 'Green', 'Blue', 
    'Purple', 'White', 'Cream', 'Beige', 'Brown', 
    'Black', 'Gray', 'Silver', 'Gold', 'Metallic', 
    'Transparent', 'Multicolor', 'Other'
  ];

  const [isNewUser, setIsNewUser] = useState(false);
  const [userDetails, setUserDetails] = useState({
    gender: '',
    preferredDesigner: [],
    age: '',
    priceRange: [],
    colorPreferences: []
  });
  
  const handleNewUserToggle = () => {
    setIsNewUser(!isNewUser);
    setUserDetails({
      gender: '',
      preferredDesigner: [],
      age: '',
      priceRange: [],
      colorPreferences: []
    });
  };
  
  const handleUserDetailChange = (field, value) => {
    setUserDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const isSignupValid = userId.trim();


  const handleLogin = async () => {
    if (!userId.trim()) {
      setError("Please enter a valid user ID.");
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await fetch('https://s5g4aq9wn1.execute-api.us-east-2.amazonaws.com/prod/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
  
      if (response.ok) {
        // Successful login (200)
        sessionStorage.setItem("userId", userId);
        setShowModal(false);
      } else if (response.status === 401) {
        // User not found
        setError("User not found. Please sign up first.");
      } else {
        // Other error
        setError("An error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!userId.trim()) {
      setError("Please enter a valid user ID.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://s5g4aq9wn1.execute-api.us-east-2.amazonaws.com/prod/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
             userId: userId.trim(),
             gender: userDetails.gender,
             age: userDetails.age,
             preferredDesigners: userDetails.preferredDesigner,
             priceRangePreference: userDetails.priceRange,
             colorPreferences: userDetails.colorPreferences
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "A user with this ID already exists");
      } else {
        sessionStorage.setItem("userId", userId);
        setShowModal(false);
      }
    } catch (err) {
      setError("Failed to sign up. Please try again.");
    } finally {
      console.log(userDetails);
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem("userId"); // Remove userId from session storage
    setUserId(""); // Clear userId from state
    setShowModal(true);
  };

  //designer selection
  const toggleDesignerSelection = (designer) => {
    setUserDetails(prev => {
      const currentDesigners = prev.preferredDesigner;
      if (currentDesigners.includes(designer)) {
        return {
          ...prev,
          preferredDesigner: currentDesigners.filter(d => d !== designer)
        };
      } else {
        return {
          ...prev,
          preferredDesigner: [...currentDesigners, designer]
        };
      }
    });
  };

  const togglePriceRange = (range) => {
    setUserDetails(prev => {
      const currentRanges = prev.priceRange;
      if (currentRanges.includes(range)) {
        return {
          ...prev,
          priceRange: currentRanges.filter(r => r !== range)
        };
      } else {
        return {
          ...prev,
          priceRange: [...currentRanges, range]
        };
      }
    });
  };
  
  const toggleColor = (color) => {
    setUserDetails(prev => {
      const currentColors = prev.colorPreferences;
      if (currentColors.includes(color)) {
        return {
          ...prev,
          colorPreferences: currentColors.filter(c => c !== color)
        };
      } else {
        return {
          ...prev,
          colorPreferences: [...currentColors, color]
        };
      }
    });
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
    

        {/* User ID Modal */}
        {/* <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton={false}>
            <Modal.Title style={{ fontFamily: "'Archivo Black', sans-serif" }}>
              {isNewUser ? "Create New Account" : "Enter Your User ID"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="userIdInput" className="mb-3">
                <Form.Label>User ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ex: bbadger"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  style={{ fontFamily: "Arial, sans-serif" }}
                />
                <Form.Text className="text-muted">
                  This ID will be used to track your votes.
                </Form.Text>
              </Form.Group>

              <Form.Check 
                type="switch"
                id="new-user-switch"
                label="New User?"
                checked={isNewUser}
                onChange={handleNewUserToggle}
                className="mb-3"
              />

              {isNewUser && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>What is your gender?</Form.Label>
                    <Form.Select 
                      value={userDetails.gender}
                      onChange={(e) => handleUserDetailChange('gender', e.target.value)}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>What is your age?</Form.Label>
                    <Form.Control
                      type="number"
                      min="15"
                      max="120"
                      value={userDetails.age}
                      onChange={(e) => handleUserDetailChange('age', e.target.value)}
                      placeholder="Enter your age"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>What is your preferred designer? (Select all that apply)</Form.Label>
                    <div className="d-flex flex-wrap" style={{ gap: '10px' }}>
                      {designers.map((designer) => (
                        <Button
                          key={designer}
                          variant={userDetails.preferredDesigner.includes(designer) ? 'secondary' : 'outline-secondary'}
                          onClick={() => toggleDesignerSelection(designer)}
                          style={{
                            borderRadius: '50px',
                            padding: '8px 12px',
                            minHeight: '40px', 
                            flex: '1 0 auto', 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <span style={{
                            display: 'inline-block',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {designer}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </Form.Group>
                </>
              )}
            </Form>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleLogin}
              disabled={isLoading || isNewUser}
              style={{
                fontFamily: "'Archivo Black', sans-serif",
              }}
            >
              Login
            </Button>
            <Button
              variant="primary"
              onClick={handleSignup}
              disabled={isLoading || !isNewUser || !isSignupValid}
              style={{
                backgroundColor: "#E85C41",
                border: "none",
                fontFamily: "'Archivo Black', sans-serif",
              }}
            >
              Sign Up
            </Button>
          </Modal.Footer>
        </Modal> */}

        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton={false}>
            <Modal.Title style={{ fontFamily: "'Archivo Black', sans-serif" }}>
              {isNewUser ? "Create New Account" : "Enter Your User ID"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="userIdInput" className="mb-3">
                <Form.Label>User ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ex: bbadger"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  style={{ fontFamily: "Arial, sans-serif" }}
                />
                <Form.Text className="text-muted">
                  This ID will be used to track your votes.
                </Form.Text>
              </Form.Group>

              <Form.Check 
                type="switch"
                id="new-user-switch"
                label="New User?"
                checked={isNewUser}
                onChange={handleNewUserToggle}
                className="mb-3"
              />

              {isNewUser && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>What is your gender?</Form.Label>
                    <Form.Select 
                      value={userDetails.gender}
                      onChange={(e) => handleUserDetailChange('gender', e.target.value)}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>What is your age?</Form.Label>
                    <Form.Control
                      type="number"
                      min="15"
                      max="120"
                      value={userDetails.age}
                      onChange={(e) => handleUserDetailChange('age', e.target.value)}
                      placeholder="Enter your age"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>What is your preferred designer? (Select all that apply)</Form.Label>
                    <div className="d-flex flex-wrap" style={{ gap: '10px' }}>
                      {designers.map((designer) => (
                        <Button
                          key={designer}
                          variant={userDetails.preferredDesigner.includes(designer) ? 'secondary' : 'outline-secondary'}
                          onClick={() => toggleDesignerSelection(designer)}
                          style={{
                            borderRadius: '50px',
                            padding: '8px 12px',
                            minHeight: '40px', 
                            flex: '1 0 auto', 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <span style={{
                            display: 'inline-block',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {designer}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </Form.Group>
                  {/* Price Range Multi-Select */}
                  <Form.Group className="mb-3">
                    <Form.Label>What are your preferred price ranges? (Select all that apply)</Form.Label>
                    <div className="d-flex flex-column" style={{ gap: '8px' }}>
                      {['Budget: Under $50', 'Affordable: $50 – $150', 'Mid-Range: $150 – $500', 
                        'Premium: $500 – $1000', 'Luxury: $1000+'].map((range) => {
                        const value = range.split(':')[0].toLowerCase().trim();
                        return (
                          <Form.Check 
                            key={value}
                            type="checkbox"
                            id={`price-${value}`}
                            label={range}
                            checked={userDetails.priceRange.includes(value)}
                            onChange={() => togglePriceRange(value)}
                            style={{"accentColor": "black", color:"black"}}
                          />
                        );
                      })}
                    </div>
                  </Form.Group>

                  {/* Color Preferences Multi-Select */}
                  <Form.Group className="mb-3">
                    <Form.Label>What are your preferred colors? (Select all that apply)</Form.Label>
                    <div className="d-flex flex-column" style={{ gap: '8px' }}>
                      {colorOptions.map((color) => {
                        const isDark = ['Black', 'Blue', 'Brown', 'Gray', 'Green', 'Purple', 'Red'].includes(color);
                        return (
                          <div key={color} className="d-flex align-items-center">
                            <Form.Check
                              type="checkbox"
                              id={`color-${color}`}
                              checked={userDetails.colorPreferences.includes(color)}
                              onChange={() => toggleColor(color)}
                              className="me-2"
                            />
                            <div 
                              style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: color.toLowerCase(),
                                border: '1px solid #ddd',
                                marginRight: '10px'
                              }}
                            />
                            <span style={{ color: isDark ? '#333' : '#000' }}>{color}</span>
                          </div>
                        );
                      })}
                    </div>
                  </Form.Group>
                </>
              )}
            </Form>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleLogin}
              disabled={isLoading || isNewUser}
              style={{
                fontFamily: "'Archivo Black', sans-serif",
              }}
            >
              Login
            </Button>
            <Button
              variant="primary"
              onClick={handleSignup}
              disabled={isLoading || !isNewUser || !isSignupValid}
              style={{
                backgroundColor: "#E85C41",
                border: "none",
                fontFamily: "'Archivo Black', sans-serif",
              }}
            >
              Sign Up
            </Button>
          </Modal.Footer>
        </Modal>
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

      {/*userId and logout display*/}
      {userId && (
        <Row className="justify-content-center mt-3 mb-3">
          <Col xs={12} className="text-center mb-2">
            <p className="mb-0"><strong>User ID: {userId}</strong></p>
          </Col>
          <Col xs="auto" className="text-center">
            <Button
              variant="warning"
              onClick={handleLogout}
              className="text-white font-weight-bold"
              style={{
                backgroundColor: "#EE4A1B",
                fontWeight: "bold",
                minWidth: "100px",
                marginBottom: "40px"
              }}
            >
              Logout
            </Button>
          </Col>
        </Row>
      )}

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
