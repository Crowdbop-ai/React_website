import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";
import { votingApi } from "../services/api"; // Import the API service

const CrowdbopVoting = () => {
  const [products, setProducts] = useState([]); // Store products from DynamoDB
  const [currentPair, setCurrentPair] = useState([]); // Track the current voting pair
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Fetch a new voting pair when the component mounts
  useEffect(() => {
    const fetchVotePair = async () => {
      try {
        const pair = await votingApi.fetchVotePair();
        setProducts(pair); // Set the fetched products
        setCurrentPair([0, 1]); // Set the initial pair indices
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching vote pair:", error);
      }
    };

    fetchVotePair();
  }, []);

  // Handle voting
  const handleVote = async (winnerProductSin) => {
    const loserProductSin = products[currentPair[0]].productSin === winnerProductSin
      ? products[currentPair[1]].productSin
      : products[currentPair[0]].productSin;

    try {
      // Submit the vote
      await votingApi.submitVote(winnerProductSin, loserProductSin);

      // Fetch a new voting pair
      const newPair = await votingApi.fetchVotePair();
      setProducts(newPair);
      setCurrentPair([0, 1]); // Reset pair indices
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5" style={{ fontWeight: "bold" }}>
        WHICH PRODUCT DO YOU PREFER?
      </h1>

      <Row className="justify-content-center">
        {currentPair.map((index) => {
          const product = products[index];
          return (
            <Col md={5} className="mb-4" key={product.productSin}>
              <div className="text-center">
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  className="img-fluid mb-3"
                  style={{ maxHeight: "400px", width: "100%", objectFit: "contain" }}
                />
                <h3 className="mt-2 font-weight-bold">{product.brand}</h3>
                <p>{product.productName}</p>
                <p className="font-weight-bold">${product.price?.toFixed(2)}</p>

                <Button
                  variant="warning"
                  onClick={() => handleVote(product.productSin)}
                  className="text-white font-weight-bold text-uppercase"
                  style={{ backgroundColor: "#EE4A1B", color: "black", width: "100%", fontWeight: "bold" }}
                >
                  Vote
                </Button>
              </div>
            </Col>
          );
        })}
      </Row>

      <div className="text-center mt-5">
        <h2 className="mb-4 font-weight-bold">Tired of Voting?</h2>
        <Link to="/rankings">
          <Button
            variant="warning"
            className="text-white font-weight-bold text-uppercase"
            style={{ backgroundColor: "#EE4A1B", color: "black", padding: "10px 30px", fontWeight: "bold" }}
          >
            Skip to Rankings
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default CrowdbopVoting;