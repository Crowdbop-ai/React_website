import React, { useEffect, useState } from "react";
import { Col, Container, Row, Button, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";

const imgBaseURL = "https://m.media-amazon.com/images/G/01/Shopbop/p";
const itemBaseURL = "https://www.shopbop.com/";

function CrowdbopRankings() {
  const [rankingsData, setRankingsData] = useState([]);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("shoes"); // Default category
  const [showCategories, setShowCategories] = useState(false); // Control dropdown visibility

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
    setPage(1); // Reset to first page when changing category
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
            { id: "clothing", name: "Clothing" },
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
          { id: "clothing", name: "Clothing" },
          { id: "bags", name: "Bags" },
          { id: "jewelry", name: "Jewelry" },
        ]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch rankings data when page or category changes
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch(
          `https://s5g4aq9wn1.execute-api.us-east-2.amazonaws.com/prod/leaderboard?category=${selectedCategory}&limit=10&offset=${
            (page - 1) * 10
          }`
        );
        if (response.ok) {
          const data = await response.json();
          setRankingsData(data.leaderboard);
        } else {
          console.error("Failed to fetch leaderboard data");
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchRankings();
  }, [page, selectedCategory]);

  const handleNext = () => {
    setPage((p) => p + 1);
  };

  const handlePrev = () => {
    setPage((p) => p - 1);
  };

  return (
    <>
      <h1 style={{ color: "#E85C41" }}>
        <Link to="/" style={{ color: "#E85C41", textDecoration: "none" }}>
          CrowdBop
        </Link>
      </h1>
      <h1>TOP RANKED PRODUCTS</h1>

      {/* Category dropdown */}
      <div className="d-flex justify-content-center my-4">
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

      <Container fluid style={{ marginTop: "2rem" }}>
        <Row>
          <Col xs={4}>
            <h2>Ranking</h2>
          </Col>
          <Col xs={4}>
            <h2>Item</h2>
          </Col>
          <Col xs={4}>
            <h2>Wins</h2>
          </Col>
        </Row>
        <hr />
        {rankingsData && rankingsData.length > 0 ? (
          rankingsData.map((item, index) => {
            return (
              <React.Fragment key={index}>
                <Row style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                  <Col
                    xs={4}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <h3 className="text-center">{item.rank}</h3>
                  </Col>
                  <Col xs={4}>
                    <a
                      href={itemBaseURL + item.ProductDetailURL}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <img
                        src={imgBaseURL + item.PrimaryImageURL}
                        alt={item.ProductName}
                        style={{ marginRight: "10px", width: "150px" }}
                      />
                      <h3 className="mb-0">{item.ProductName}</h3>
                    </a>
                  </Col>
                  <Col
                    xs={4}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <h3 className="text-center">{item.Wins}</h3>
                  </Col>
                </Row>
                {index === rankingsData.length - 1 ? "" : <hr />}
              </React.Fragment>
            );
          })
        ) : (
          <div className="text-center my-5">
            <h3>No ranked products in this category yet</h3>
            <Link to="/">
              <Button
                className="mt-3"
                style={{
                  backgroundColor: "#EE4A1B",
                  borderColor: "#EE4A1B",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                Go Vote!
              </Button>
            </Link>
          </div>
        )}
        {rankingsData && rankingsData.length > 0 && (
          <Pagination
            size="lg"
            style={{ marginBottom: "5rem", marginLeft: "10%" }}
          >
            <Pagination.Prev disabled={page === 1} onClick={handlePrev} />
            <Pagination.Next onClick={handleNext} />
          </Pagination>
        )}
      </Container>
    </>
  );
}

export default CrowdbopRankings;
