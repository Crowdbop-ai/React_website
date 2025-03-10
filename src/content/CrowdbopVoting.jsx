import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";
import placeholderImage from "../assets/loading.JPG"; // Import the placeholder image

const CrowdbopVoting = () => {
  const [currentProducts, setCurrentProducts] = useState([]); // Current pair of products to display
  const [nextProducts, setNextProducts] = useState([]); // Pre-fetched next pair of products
  const [isLoading, setIsLoading] = useState(true); // Track loading state (only for initial load)

  // Fetch the first pair of products on page load
  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        const response = await fetch(
          "https://s5g4aq9wn1.execute-api.us-east-2.amazonaws.com/prod/comparison?category=shoes"
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
  }, []);

  // Function to fetch the next pair of products
  const fetchNextPair = async () => {
    try {
      const response = await fetch(
        "https://s5g4aq9wn1.execute-api.us-east-2.amazonaws.com/prod/comparison?category=shoes"
      );
      const data = await response.json();
      setNextProducts(data.products);
    } catch (error) {
      console.error("Error fetching next product pair:", error);
    }
  };

  const handleVote = (winnerIndex) => {
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
              categoryId: "shoes", // Hardcoded category for now
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

    // Fetch the next pair immediately
    fetchNextPair();
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5" style={{ fontWeight: "bold" }}>
        WHICH PRODUCT DO YOU PREFER?
      </h1>

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
                  style={{ maxHeight: "400px", width: "100%", objectFit: "contain" }}
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
                  style={{ maxHeight: "400px", width: "100%", objectFit: "contain" }}
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
                  <img
                    src={imageUrl}
                    alt={product.ProductName}
                    className="img-fluid mb-3"
                    style={{ maxHeight: "400px", width: "100%", objectFit: "contain" }}
                  />
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
                  <p><b>${product.Price.toFixed(2)}</b></p>

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
                  >
                    Vote
                  </Button>
                </div>
              </Col>
            );
          })
        )}
      </Row>

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

      {/* TODO: Make category selection dynamic in the future */}
    </Container>
  );
};

export default CrowdbopVoting;