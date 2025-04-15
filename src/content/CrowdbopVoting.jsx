import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Row, Col, Modal, Form } from "react-bootstrap";
import { FaHeart } from "react-icons/fa";
import placeholderImage from "../assets/loading.JPG"; // Import the placeholder image
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const CrowdbopVoting = () => {
  const [currentProducts, setCurrentProducts] = useState([]); // Current pair of products to display
  const [nextProducts, setNextProducts] = useState([]); // Pre-fetched next pair of products
  const [isLoading, setIsLoading] = useState(true); // Track loading state (only for initial load)
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [userId, setUserId] = useState(sessionStorage.getItem("userId") || ""); // Get userId from session storage if it exists
  const [categories, setCategories] = useState([]); // List of available categories
  const [selectedCategory, setSelectedCategory] = useState(sessionStorage.getItem("selectedCategory") || "shoes"); // Default category
  const [showCategories, setShowCategories] = useState(false); // Control dropdown visibility
  const [likedItems, setLikedItems] = useState([0, 0]);

  // Fetch available categories on page load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://s5g4aq9wn1.execute-api.us-east-2.amazonaws.com/prod/categories"
        );
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
        } else {
          console.error("Failed to fetch categories");
          // Fallback to hardcoded categories if API fails
          setCategories([
            { id: "shoes", name: "Shoes" },
            { id: "accessories", name: "Accessories" },
            { id: "clothing", name: "Dresses" },
            { id: "bags", name: "Bags" },
            { id: "jewelry", name: "Jewelry" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to hardcoded categories if API fails
        setCategories([
          { id: "shoes", name: "Shoes" },
          { id: "accessories", name: "Accessories" },
          { id: "clothing", name: "Dresses" },
          { id: "bags", name: "Bags" },
          { id: "jewelry", name: "Jewelry" },
        ]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch the first pair of products on page load and when category changes
  useEffect(() => {
    const fetchInitialProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://s5g4aq9wn1.execute-api.us-east-2.amazonaws.com/prod/comparison?category=${selectedCategory}`
        );
        const data = await response.json();
        setCurrentProducts(data.products);

        // Fetch the next pair immediately after the first pair is fetched
        fetchNextPair();
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        // After 1 second, hide the loading placeholder
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    fetchInitialProducts();
  }, [selectedCategory]); // Re-fetch when selected category changes

  // Function to fetch the next pair of products
  const fetchNextPair = async () => {
    try {
      const response = await fetch(
        `https://s5g4aq9wn1.execute-api.us-east-2.amazonaws.com/prod/comparison?category=${selectedCategory}`
      );
      const data = await response.json();
      setNextProducts(data.products);
    } catch (error) {
      console.error("Error fetching next product pair:", error);
    }
  };

  // Handle liking item
  const handleLike = async (product, index) => {
    if (!userId) {
      alert("Please log in to like products.");
      setShowModal(true);
      return;
    }

    try {
      const newArray = [...likedItems];
      newArray[index] = 1;
      setLikedItems(newArray);
      const response = await fetch(
        "https://s5g4aq9wn1.execute-api.us-east-2.amazonaws.com/prod/add-like",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            productSIN: product.ProductSIN,
            categoryId: selectedCategory,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to like product");
      console.log("Product liked successfully");
    } catch (error) {
      console.error("Error liking product:", error);
    }
  };

  // Handle modal submission
  const handleSubmit = () => {
    if (userId.trim()) {
      sessionStorage.setItem("userId", userId); // Store userId in session storage
      setShowModal(false); // Close the modal
    } else {
      alert("Please enter a valid user ID.");
    }
  };

  // Handle voting
  const handleVote = (winnerIndex) => {
    if (!userId) {
      alert("Please enter a user ID to vote.");
      setShowModal(true); // Reopen the modal if no user ID is provided
      return;
    }

    // Determine the winner and loser
    const winner = currentProducts[winnerIndex];
    const loser = currentProducts[1 - winnerIndex]; // The other product is the loser

    // Log the winner's SIN and name
    console.log("Voted on Product:", {
      SIN: winner.ProductSIN,
      Name: winner.ProductName,
    });

    // Send the vote result to the API
    const sendVote = async () => {
      try {
        const response = await fetch(
          "https://s5g4aq9wn1.execute-api.us-east-2.amazonaws.com/prod/vote",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              winnerSIN: winner.ProductSIN,
              loserSIN: loser.ProductSIN,
              categoryId: selectedCategory, // Now using the selected category
              userId: userId, // Include the user ID in the vote submission
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to submit vote");
        }

        console.log("Vote submitted successfully!");
      } catch (error) {
        console.error("Error submitting vote:", error);
      }
    };

    // Submit the vote
    sendVote();

    // Replace the current pair with the pre-fetched next pair
    setCurrentProducts(nextProducts);

    // Reset the liked items for the new pair
    setLikedItems([0, 0]);

    // Fetch the next pair immediately
    fetchNextPair();
  };

  // Format category ID for display (remove underscores, capitalize first letter)
  const formatCategoryName = (categoryId) => {
    if (!categoryId) return "";
    return categoryId
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowCategories(false); // Close dropdown after selection
    // Save in session storage
    sessionStorage.setItem("selectedCategory", categoryId)
  };

  // Like Button tooltip
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Click to add this item to your liked items!
    </Tooltip>
  );

  return (
    <Container>
      <h1 className="text-center mb-4" style={{ fontWeight: "bold" }}>
        WHICH PRODUCT DO YOU PREFER?
      </h1>

      {/* Category dropdown */}
      <div className="d-flex justify-content-center mb-4">
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "5px",
            padding: "5px 10px",
            background: "#EE4A1B",
            position: "relative",
            zIndex: 1000,
            cursor: "pointer",
            color: "black",
            fontWeight: "bold",
            minWidth: "200px",
            textAlign: "center",
          }}
          onClick={() => setShowCategories(!showCategories)}
        >
          Category: {formatCategoryName(selectedCategory)} ▼
          {showCategories && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "0 0 5px 5px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategorySelect(category.id);
                  }}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    backgroundColor:
                      selectedCategory === category.id
                        ? "#f5f5f5"
                        : "transparent",
                    color: "black",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f0f0f0")
                  }
                  onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    selectedCategory === category.id
                      ? "#f5f5f5"
                      : "transparent")
                  }
                >
                  {category.name || formatCategoryName(category.id)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Display */}
      <Row className="justify-content-center">
        {isLoading ? (
          // Show loading placeholder only on initial load
          <>
            <Col md={5} className="mb-4">
              <div className="text-center">
                <img
                  src={placeholderImage}
                  alt="Loading..."
                  className="img-fluid mb-3"
                  style={{
                    maxHeight: "400px",
                    width: "100%",
                    objectFit: "contain",
                  }}
                />
                <h3 className="mt-2 font-weight-bold">Loading...</h3>
                <p>Loading...</p>
                <p className="font-weight-bold">Loading...</p>
              </div>
            </Col>
            <Col md={5} className="mb-4">
              <div className="text-center">
                <img
                  src={placeholderImage}
                  alt="Loading..."
                  className="img-fluid mb-3"
                  style={{
                    maxHeight: "400px",
                    width: "100%",
                    objectFit: "contain",
                  }}
                />
                <h3 className="mt-2 font-weight-bold">Loading...</h3>
                <p>Loading...</p>
                <p className="font-weight-bold">Loading...</p>
              </div>
            </Col>
          </>
        ) : (
          // Show the current pair of products
          currentProducts.map((product, index) => {
            const imageUrl = `https://m.media-amazon.com/images/G/01/Shopbop/p/${product.PrimaryImageURL}`;

            return (
              <Col md={5} className="mb-4" key={product.ProductSIN}>
                <div className="text-center">
                  <div style={{ position: "relative", marginBottom: "1rem" }}>
                    <img
                      src={imageUrl}
                      alt={product.ProductName}
                      className="img-fluid"
                      style={{
                        maxHeight: "400px",
                        width: "100%",
                        objectFit: "contain",
                      }}
                    />
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip}
                    >
                      <Button
                        variant="link"
                        onClick={() => handleLike(product, index)}
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          backgroundColor: "white",
                          borderRadius: "50%",
                          padding: "4px",
                          lineHeight: 1,
                          zIndex: 10,
                          color: likedItems[index] == 1 ? "#EE4A1B" : "#808080",
                        }}
                        aria-label={`Like ${product.ProductName}`}
                      >
                        <FaHeart size={30} />
                      </Button>
                    </OverlayTrigger>
                  </div>
                  <h3
                    className="mt-2 font-weight-bold"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.ProductName}
                  </h3>
                  <p>{product.DesignerName}</p>
                  <p>
                    <b>${product.Price.toFixed(2)}</b>
                  </p>

                  <Button
                    variant="warning"
                    onClick={() => handleVote(index)}
                    className="text-white font-weight-bold text-uppercase"
                    style={{
                      backgroundColor: "#EE4A1B",
                      color: "black",
                      width: "100%",
                      fontWeight: "bold",
                    }}
                    disabled={!userId} // Disable button if no user ID is provided
                  >
                    Vote
                  </Button>
                </div>
              </Col>
            );
          })
        )}
      </Row>

      {/* Tired of Voting Section */}
      <div className="text-center mt-5">
        <h2 className="mb-4 font-weight-bold">Tired of Voting?</h2>
        <Link to="/rankings">
          <Button
            variant="warning"
            className="text-white font-weight-bold text-uppercase"
            style={{
              backgroundColor: "#EE4A1B",
              color: "black",
              padding: "10px 30px",
              fontWeight: "bold",
            }}
          >
            Skip to Rankings
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default CrowdbopVoting;
