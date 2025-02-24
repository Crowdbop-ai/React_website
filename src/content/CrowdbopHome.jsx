import React, { memo } from "react";
import { Link } from "react-router-dom";

function CrowdbopHome() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to CrowdBop
      </h1>

      <div className="text-center mb-12">
        <p className="text-lg mb-8">
          Help us discover the most popular items by voting on your favorites!
          Your opinions shape our collection.
        </p>

        <Link
          to="/voting"
          className="block bg-orange text-[#E85C41] px-12 py-5 
    font-bold text-2xl uppercase tracking-wider hover:text-[#D54E35] 
    transition-colors rounded border-2 border-[#E85C41] mt-16 relative"
        >
          Start Voting Now
        </Link>
      </div>

      <div className="bg-gray-100 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <ol className="list-decimal pl-5 space-y-3">
          <li>Vote between pairs of products from ShopBop's catalog</li>
          <li>Each vote helps us determine which products are most popular</li>
          <li>View the rankings to see which items are trending</li>
          <li>Discover new favorites you might have missed</li>
        </ol>
      </div>
    </div>
  );
}

export default memo(CrowdbopHome);
