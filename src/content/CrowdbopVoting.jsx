import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Row, Col, Modal, Form } from "react-bootstrap";
import { FaHeart } from "react-icons/fa";
import placeholderImage from "../assets/loading.JPG"; // Import the placeholder image
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const CrowdbopVoting = () => {
  const [currentProducts, setCurrentProducts] = useState([]); // Current pair of products to display
  const [nextProducts, setNextProducts] = useState([]); // Pre-fetched next pair of products
  const [isLoading, setIsLoading] = useState(true); // Track loading state (only for initial load)
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [userId, setUserId] = useState(sessionStorage.getItem("userId") || ""); // Get userId from session storage if it exists
  const [categories, setCategories] = useState([]); // List of available categories
  const [selectedCategory, setSelectedCategory] = useState(
    sessionStorage.getItem("selectedCategory") || "shoes"
  ); // Default category
  const [showCategories, setShowCategories] = useState(false); // Control dropdown visibility
  const [showFilters, setShowFilters] = useState(false); // Control filters visibility
  const [likedItems, setLikedItems] = useState([0, 0]);
  const [userDetails, setUserDetails] = useState({
    gender: "",
    priceRange: [],
    color: [],
  });

  console.log(userDetails);

  const colorOptions = [
    "Red",
    "Pink",
    "Orange",
    "Yellow",
    "Green",
    "Blue",
    "Purple",
    "White",
    "Cream",
    "Beige",
    "Brown",
    "Black",
    "Gray",
    "Silver",
    "Gold",
    "Metallic",
    "Transparent",
    "Multicolor",
    "Other",
  ];

  const togglePriceRange = (range) => {
    setUserDetails((prev) => {
      const currentRanges = prev.priceRange;
      if (currentRanges.includes(range)) {
        return {
          ...prev,
          priceRange: currentRanges.filter((r) => r !== range),
        };
      } else {
        return {
          ...prev,
          priceRange: [...currentRanges, range],
        };
      }
    });
  };

  const toggleColor = (color) => {
    setUserDetails((prev) => {
      const currentColors = prev.color;
      if (currentColors.includes(color)) {
        return {
          ...prev,
          color: currentColors.filter((c) => c !== color),
        };
      } else {
        return {
          ...prev,
          color: [...currentColors, color],
        };
      }
    });
  };

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

  // Extracted function to fetch products based on current filters.
  const fetchInitialProducts = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        category: selectedCategory,
        gender: userDetails.gender,
        priceRange: userDetails.priceRange.join(","),
        color: userDetails.color.join(","),
      });
      const response = await fetch(
        `https://s5g4aq9wn1.execute-api.us-east-2.amazonaws.com/prod/comparison?${queryParams.toString()}`
      );
      console.log(
        `https://s5g4aq9wn1.execute-api.us-east-2.amazonaws.com/prod/comparison?${queryParams.toString()}`
      );
      const data = await response.json();
      setCurrentProducts(data.products);
      // Fetch the next pair immediately after.
      fetchNextPair();
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  // New handler for applying filters.
  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchInitialProducts();
    setShowFilters(false);
  };

  // useEffect now calls the extracted function.
  useEffect(() => {
    fetchInitialProducts();
  }, [selectedCategory]);

  // Function to fetch the next pair of products
  const fetchNextPair = async () => {
    try {
      const queryParams = new URLSearchParams({
        category: selectedCategory,
        gender: userDetails.gender,
        priceRange: userDetails.priceRange.join(","),
        color: userDetails.color.join(","),
      });
      const response = await fetch(
        `https://s5g4aq9wn1.execute-api.us-east-2.amazonaws.com/prod/comparison?${queryParams.toString()}`
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

  const handleUserDetailChange = (field, value) => {
    setUserDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
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
      alert("Please log in to vote.");
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
    sessionStorage.setItem("selectedCategory", categoryId);
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
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "5px",
            padding: "5px 10px",
            marginLeft: "10px",
            background: "#EE4A1B",
            position: "relative",
            zIndex: 1000,
            cursor: "pointer",
            color: "black",
            fontWeight: "bold",
            minWidth: "200px",
            textAlign: "center",
          }}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters ▼
          {showFilters && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "0 0 5px 5px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                maxHeight: "500px",
                width: "400px",
                overflowY: "auto",
              }}
            >
              <Form onSubmit={handleApplyFilters}>
                {/* User Gender */}
                <Form.Group className="mb-3 p-3">
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

                {/* Price Range Multi-Select */}
                <Form.Group className="mb-3 p-3">
                  <Form.Label>
                    What are your preferred price ranges? (Select all that
                    apply)
                  </Form.Label>
                  <div className="d-flex flex-column" style={{ gap: "8px" }}>
                    {[
                      "Budget: Under $50",
                      "Affordable: $50 – $150",
                      "Mid-Range: $150 – $500",
                      "Premium: $500 – $1000",
                      "Luxury: $1000+",
                    ].map((range) => {
                      const value = range.split(":")[0].toLowerCase().trim();
                      return (
                        <Form.Check
                          key={value}
                          type="checkbox"
                          id={`price-${value}`}
                          label={range}
                          checked={userDetails.priceRange.includes(value)}
                          onChange={() => togglePriceRange(value)}
                          // disabled={userDetails.priceRange.length > 0 && !userDetails.priceRange.includes(value)}
                          style={{ accentColor: "black", color: "black" }}
                        />
                      );
                    })}
                  </div>
                </Form.Group>

                {/* Color Preferences Multi-Select */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">
                    What are your preferred colors? (Select all that apply)
                  </Form.Label>
                  <div
                    className="d-grid"
                    style={{
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "16px",
                    }}
                  >
                    {colorOptions.map((color) => {
                      const isDark = [
                        "Black",
                        "Blue",
                        "Brown",
                        "Gray",
                        "Green",
                        "Purple",
                        "Red",
                      ].includes(color);
                      const isSelected = userDetails.color.includes(color);
                      return (
                        <div
                          key={color}
                          className="d-flex align-items-center rounded p-2"
                          style={{
                            border: isSelected
                              ? "1px solid #EE4A1B"
                              : "1px solid #ccc",
                            backgroundColor: isSelected ? "#FFF4EE" : "#f8f9fa",
                            transition: "all 0.2s ease-in-out",
                            cursor: "pointer",
                            margin: "5px",
                          }}
                          onClick={() => toggleColor(color)}
                        >
                          <div
                            style={{
                              width: "24px",
                              height: "24px",
                              backgroundColor: color.toLowerCase(),
                              border: "1px solid #ddd",
                              borderRadius: "50%",
                              marginRight: "12px",
                              boxShadow: "0 0 3px rgba(0,0,0,0.2)",
                            }}
                          />
                          <span
                            style={{
                              color: isDark ? "#333" : "#000",
                              flex: 1,
                              fontWeight: isSelected ? "bold" : "normal",
                            }}
                          >
                            {color}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Form.Group>
                <Button
                  className="mb-3 p-2"
                  variant="light"
                  type="submit"
                  style={{
                    border: "2px solid #ddd",
                    borderRadius: "5px",
                  }}
                >
                  Apply Filters
                </Button>
              </Form>
            </div>
          )}
        </div>
      </div>

      {/* Product Display */}
      {/* Product Display */}
      <Row className="justify-content-center">
        {isLoading ? (
          // Show loading placeholder only on initial load
          <>
            <Col xs={6} md={5} className="mb-4">
              {" "}
              {/* Changed to xs={6} */}
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
            <Col xs={6} md={5} className="mb-4">
              {" "}
              {/* Changed to xs={6} */}
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
              <Col xs={6} md={5} className="mb-4 px-2" key={product.ProductSIN}>
                {" "}
                {/* Changed to xs={6} and added px-2 */}
                <div className="text-center h-100">
                  <div
                    style={{
                      position: "relative",
                      marginBottom: "1rem",
                      height: "calc(100% - 120px)", // Adjust based on your content height
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={product.ProductName}
                      className="img-fluid"
                      style={{
                        maxHeight: "300px", // Reduced from 400px
                        width: "100%",
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                      onClick={() => handleVote(index)}
                    />
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 250, hide: 400 }}
                      overlay={renderTooltip}
                    >
                      <Button
                        variant="link"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(product, index);
                        }}
                        style={{
                          position: "absolute",
                          top: "8px", // Reduced from 12px
                          right: "8px", // Reduced from 12px
                          backgroundColor: "white",
                          borderRadius: "50%",
                          padding: "2px", // Reduced from 4px
                          lineHeight: 1,
                          zIndex: 10,
                          color: likedItems[index] == 1 ? "#EE4A1B" : "#808080",
                        }}
                        aria-label={`Like ${product.ProductName}`}
                      >
                        <FaHeart size={24} /> {/* Reduced from 30px */}
                      </Button>
                    </OverlayTrigger>
                  </div>
                  <div style={{ minHeight: "120px" }}>
                    {" "}
                    {/* Fixed height for text content */}
                    <h3
                      className="mt-2 font-weight-bold"
                      style={{
                        fontSize: "1rem", // Reduced font size
                        display: "flex",
                        justifyContent: "center",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {product.ProductName}
                    </h3>
                    <p style={{ fontSize: "0.9rem" }}>{product.DesignerName}</p>
                    <p style={{ fontSize: "0.9rem" }}>
                      <b>${product.Price.toFixed(2)}</b>
                    </p>
                  </div>

                  <Button
                    variant="warning"
                    onClick={() => handleVote(index)}
                    className="text-white font-weight-bold text-uppercase"
                    style={{
                      backgroundColor: "#EE4A1B",
                      color: "black",
                      width: "100%",
                      fontWeight: "bold",
                      fontSize: "0.9rem", // Reduced font size
                      padding: "0.375rem 0.75rem", // Smaller padding
                    }}
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
      <style>
        {`
          .form-check-input {
            border: 2px solid #000;
          }
        `}
      </style>
    </Container>
  );
};

export default CrowdbopVoting;
