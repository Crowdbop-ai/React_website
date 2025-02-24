import React, { useState } from "react";
import { Link } from "react-router-dom";

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12">
        WHICH PRODUCT DO YOU PREFER?
      </h1>

      <div className="flex justify-center space-x-12 mb-16">
        {currentPair.map((index) => {
          const product = products[index];
          return (
            <div
              key={product.id}
              className="flex flex-col items-center text-center"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full object-contain mb-4"
              />

              <div className="text-center mt-2 mb-4">
                <h3 className="font-bold">{product.brand}</h3>
                <p>{product.name}</p>
                <p className="mt-1">${product.price.toFixed(2)}</p>
              </div>

              <button
                onClick={() => handleVote(product.id)}
                style={{ backgroundColor: "#E85C41" }}
                className="text-white px-12 py-2 
                           font-bold uppercase tracking-wider w-full md:w-auto"
              >
                VOTE
              </button>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-16">
        <h2 className="text-3xl font-bold mb-4">Tired of Voting?</h2>
        <Link
          to="/rankings"
          style={{ backgroundColor: "#E85C41" }}
          className="text-white px-12 py-2 
                           font-bold uppercase tracking-wider w-full md:w-auto"
        >
          SKIP TO RANKINGS
        </Link>
      </div>
    </div>
  );
};

export default CrowdbopVoting;
