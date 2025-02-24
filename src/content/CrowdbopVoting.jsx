import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";

// Import images
import londonJeans from "../assets/london_jeans.jpg";
import pennyUtility from "../assets/penny_utility_pants.jpg";
import maxiDress from "../assets/field_of_dreams_maxi_dress.jpg";
import sneakers from "../assets/cloud_6_sneakers.jpg";
import tankDress from "../assets/catch_a_wave_tank_dress.jpg";

const CrowdbopVoting = () => {
  // Sample product data with imported images
  const [products] = useState([
    {
      id: 1,
      brand: "Le Superbe",
      name: "Catch A Wave Tank Dress",
      price: 395.0,
      image: tankDress,
    },
    {
      id: 2,
      brand: "Lioness",
      name: "Field of Dreams Maxi Dress",
      price: 109.0,
      image: maxiDress,
    },
    {
      id: 3,
      brand: "On",
      name: "Cloud 6 Sneakers",
      price: 139.95,
      image: sneakers,
    },
    {
      id: 4,
      brand: "Frame",
      name: "London Jeans",
      price: 248.0,
      image: londonJeans,
    },
    {
      id: 5,
      brand: "AG",
      name: "Penny Utility Pants",
      price: 225.0,
      image: pennyUtility,
    },
  ]);

  // Track which products we're currently displaying
  const [currentPair, setCurrentPair] = useState([0, 1]);
  const [votes, setVotes] = useState({});

  const handleVote = (productId) => {
    // Update votes
    setVotes((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));

    // Move to next pair - for simplicity, just cycle through the products
    setCurrentPair((prevPair) => {
      const nextIndex1 = (prevPair[0] + 2) % products.length;
      const nextIndex2 = (prevPair[1] + 2) % products.length;

      // Make sure we don't show the same product twice
      return nextIndex1 === nextIndex2
        ? [nextIndex1, (nextIndex1 + 1) % products.length]
        : [nextIndex1, nextIndex2];
    });
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5" style={{ fontWeight: "bold" }}>
        WHICH PRODUCT DO YOU PREFER?
      </h1>

      <Row className="justify-content-center">
        {currentPair.map((index) => {
          const product = products[index];
          return (
            <Col md={5} className="mb-4" key={product.id}>
              <div className="text-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="img-fluid mb-3"
                  style={{ maxHeight: "400px", objectFit: "contain" }}
                />
                <h3 className="mt-2 font-weight-bold">{product.brand}</h3>
                <p>{product.name}</p>
                <p className="font-weight-bold">${product.price.toFixed(2)}</p>

                <Button
                  variant="warning"
                  onClick={() => handleVote(product.id)}
                  className="text-white font-weight-bold text-uppercase"
                  style={{ backgroundColor: "#EE4A1B", color: "black", width: "100%", fontWeight: "bold"}}
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
            style={{ backgroundColor: "#EE4A1B", color: "black", padding: "10px 30px", fontWeight: "bold"}}
            >
            Skip to Rankings
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default CrowdbopVoting;
