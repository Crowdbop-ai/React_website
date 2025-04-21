import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Alert,
  Container,
  Card,
} from "react-bootstrap";
import "../CrowdbopHome.css"; // We'll create this custom CSS file

const CrowdbopHome = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(sessionStorage.getItem("userId") || "");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [designers, setDesigners] = useState([]); // designerNames
  const [reload, setReload] = useState(false);

  // Fetch designers
  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        const response = await fetch("src/assets/top_designers.json");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (!data) throw new Error("No data received");
        const designerNames = Object.values(data);
        setDesigners(designerNames);
      } catch (err) {
        console.error("Failed to fetch designers:", err);
        setError("Failed to load designer data. Please refresh the page.");
      }
    };
  
    fetchDesigners();
    setTimeout(() => setIsAnimated(true), 100);
  }, []);
  
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
    setUserDetails((prev) => ({
      ...prev,
      [field]: value,
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
      const response = await fetch(
        "https://s5g4aq9wn1.execute-api.us-east-2.amazonaws.com/prod/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (response.ok) {
        sessionStorage.setItem("userId", userId);
        sessionStorage.removeItem("showLoginModal");
        window.dispatchEvent(new Event("storage"));
        setShowModal(false);
      } else if (response.status === 401) {
        setError("User not found. Please sign up first.");
      } else {
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
        sessionStorage.removeItem("showLoginModal");
        window.dispatchEvent(new Event("storage"));
        setShowModal(false);
      }
    } catch (err) {
      setError("Failed to sign up. Please try again.");
    } finally {
      console.log(userDetails);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    setUserId("");
    setShowModal(true);
  };

  const toggleDesignerSelection = (designer) => {
    setUserDetails((prev) => {
      const currentDesigners = prev.preferredDesigner;
      if (currentDesigners.includes(designer)) {
        return {
          ...prev,
          preferredDesigner: currentDesigners.filter((d) => d !== designer),
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
    <Container className="crowdbop-container py-4">
      {/* Header Section */}
      <div
        className={`header-section text-center mb-5 ${
          isAnimated ? "animated" : ""
        }`}
      >
        <h1 className="display-4 mb-3">
          Welcome to <span className="text-primary">CrowdBop</span>
        </h1>

        <p className="lead mb-5 mx-auto crowdbop-intro">
          Help us discover the most popular items by voting on your favorites!
          Your opinions shape our collection.
        </p>

        <Modal
          show={sessionStorage.getItem("showLoginModal")==="true"}
          onHide={() => {
            sessionStorage.removeItem("showLoginModal");
            setReload(prev => !prev);         
          }}
          centered
          backdrop="static"
          keyboard={true}
        >
          <Modal.Header closeButton>
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
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">What are your preferred colors? (Select all that apply)</Form.Label>
                    <div className="d-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                      {colorOptions.map((color) => {
                        const isDark = ['Black', 'Blue', 'Brown', 'Gray', 'Green', 'Purple', 'Red'].includes(color);
                        const isSelected = userDetails.colorPreferences.includes(color);
                        return (
                          <div 
                            key={color} 
                            className="d-flex align-items-center rounded p-2"
                            style={{
                              border: isSelected ? '2px solid #EE4A1B' : '1px solid #ccc',
                              backgroundColor: '#f8f9fa',
                              transition: 'all 0.2s ease-in-out',
                              cursor: 'pointer',
                            }}
                            onClick={() => toggleColor(color)}
                          >
                            <div 
                              style={{
                                width: '24px',
                                height: '24px',
                                backgroundColor: color.toLowerCase(),
                                border: '1px solid #ddd',
                                borderRadius: '50%',
                                marginRight: '12px',
                                boxShadow: '0 0 3px rgba(0,0,0,0.2)'
                              }}
                            />
                            <span style={{ color: isDark ? '#333' : '#000', flex: 1 }}>{color}</span>
                            <Form.Check
                              type="checkbox"
                              id={`color-${color}`}
                              checked={isSelected}
                              onChange={() => toggleColor(color)}
                              className="ms-2"
                              style={{ pointerEvents: 'none' }} // prevents double toggle
                            />
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
              className="crowdbop-font"
            >
              Login
            </Button>
            <Button
              variant="primary"
              onClick={handleSignup}
              disabled={isLoading || !isNewUser || !isSignupValid}
              className="crowdbop-font crowdbop-button"
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
              className="ms-2 arrow-animation"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          <button
            onClick={() => navigate("/rankings")}
          >
            Skip to Leaderboard
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ms-2 arrow-animation"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Button>
        </div>
      </div>


      {/* How It Works Section */}
      <Card
        className={`how-it-works-section shadow ${
          isAnimated ? "animated-delay" : ""
        }`}
      >
        <Card.Body className="p-4">
          <h2 className="text-center mb-4 section-title position-relative">
            How It Works
          </h2>

          <Row xs={1} md={2} lg={3} className="g-4">
            {/* Step 1 */}
            <Col>
              <Card className="step-card h-100">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div className="step-number me-3">1</div>
                    <h3 className="step-title m-0">Vote on Pairs</h3>
                  </div>
                  <Card.Text className="step-text">
                    Choose between pairs of products from ShopBop's catalog
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Step 2 */}
            <Col>
              <Card className="step-card h-100">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div className="step-number me-3">2</div>
                    <h3 className="step-title m-0">Track Popularity</h3>
                  </div>
                  <Card.Text className="step-text">
                    Each vote helps us determine which products are most popular
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Step 3 */}
            <Col>
              <Card className="step-card h-100">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div className="step-number me-3">3</div>
                    <h3 className="step-title m-0">View Trends</h3>
                  </div>
                  <Card.Text className="step-text">
                    See rankings to discover which items are trending
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Step 4 */}
            <Col>
              <Card className="step-card h-100">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div className="step-number me-3">4</div>
                    <h3 className="step-title m-0">Discover New Items</h3>
                  </div>
                  <Card.Text className="step-text">
                    Find new favorites you might have missed
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Step 5 */}
            <Col>
              <Card className="step-card h-100">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div className="step-number me-3">5</div>
                    <h3 className="step-title m-0">ELO Ranking System</h3>
                  </div>
                  <Card.Text className="step-text">
                    Our leaderboard uses the ELO system from chess - items gain
                    or lose points based on their rank and who they beat,
                    creating a dynamic ranking that evolves with each vote.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Step 6 */}
            <Col>
              <Card className="step-card h-100">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div className="step-number me-3">5</div>
                    <h3 className="step-title m-0">Liked List</h3>
                  </div>
                  <Card.Text className="step-text">
                    With the liked list feature, you can mark your favorite
                    items by clicking the "heart" button while voting. Each
                    liked item is automatically saved to your personal
                    collection, creating a curated list of your top picks.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Background decoration remains as is but could be moved to CSS */}
      <div className="background-decoration">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="decoration-dot"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
            }}
          />
        ))}
      </div>
    </Container>
  );
};

export default CrowdbopHome;
