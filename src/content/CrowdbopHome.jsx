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
  const [designers, setDesigners] = useState([]);
  const [isNewUser, setIsNewUser] = useState(false);
  const [userDetails, setUserDetails] = useState({
    gender: "",
    preferredDesigner: [],
    age: "",
  });

  // Fetch designers
  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        const response = await fetch("src/assets/top_designers.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data) {
          throw new Error("No data received");
        }
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

  const handleNewUserToggle = () => {
    setIsNewUser(!isNewUser);
    setUserDetails({
      gender: "",
      preferredDesigner: [],
      age: "",
    });
  };

  const handleUserDetailChange = (field, value) => {
    setUserDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isSignupValid =
    userId.trim() &&
    userDetails.gender &&
    userDetails.preferredDesigner.length > 0 &&
    userDetails.age;

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
          body: JSON.stringify({ userId: userId.trim() }),
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
          preferredDesigner: [...currentDesigners, designer],
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

        {/* User ID Modal */}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton={false}>
            <Modal.Title className="crowdbop-font">
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
                      onChange={(e) =>
                        handleUserDetailChange("gender", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleUserDetailChange("age", e.target.value)
                      }
                      placeholder="Enter your age"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      What is your preferred designer? (Select all that apply)
                    </Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {designers.map((designer) => (
                        <Button
                          key={designer}
                          variant={
                            userDetails.preferredDesigner.includes(designer)
                              ? "secondary"
                              : "outline-secondary"
                          }
                          onClick={() => toggleDesignerSelection(designer)}
                          className="designer-button"
                        >
                          <span className="designer-name">{designer}</span>
                        </Button>
                      ))}
                    </div>
                  </Form.Group>
                </>
              )}
            </Form>
            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}
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
              {isLoading ? "Signing Up..." : "Sign Up"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Action Buttons */}
        <div className="d-flex flex-column align-items-center gap-4 mt-4">
          <Button
            variant="outline-primary"
            className="crowdbop-action-button"
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
          </Button>

          <Button
            variant="outline-primary"
            className="crowdbop-action-button"
            onClick={() => navigate("/liked")}
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
              className="ms-2 arrow-animation"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Button>

          <Button
            variant="outline-primary"
            className="crowdbop-action-button"
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

      {/* User ID and Logout Display */}
      {userId && (
        <Row className="justify-content-center mt-3 mb-5">
          <Col xs={12} className="text-center mb-2">
            <p className="mb-0">
              <strong>User ID: {userId}</strong>
            </p>
          </Col>
          <Col xs="auto" className="text-center">
            <Button
              variant="warning"
              onClick={handleLogout}
              className="fw-bold text-white crowdbop-logout-btn"
            >
              Logout
            </Button>
          </Col>
        </Row>
      )}

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
