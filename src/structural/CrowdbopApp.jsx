import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CrowdbopLayout from "./CrowdbopLayout";
import CrowdbopHome from "../content/CrowdbopHome";
import CrowdbopRankings from "../content/CrowdbopRankings";
import CrowdbopVoting from "../content/CrowdbopVoting";
import CrowdbopLikedItems from "../content/CrowdbopLikedItems";
import CrowdbopRecommended from "../content/CrowdbopRecommended";

function CrowdbopApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CrowdbopLayout />}>
          {/*  Add a "home route" */}
          <Route index element={<CrowdbopHome />} />
          <Route path="/rankings" element={<CrowdbopRankings />}></Route>
          <Route path="/voting" element={<CrowdbopVoting />}></Route>
          <Route path="/liked" element={<CrowdbopLikedItems />}></Route>
          <Route path="/recommended" element={<CrowdbopRecommended />}></Route>
          {/* TODO: Add a route for each page */}
          {/* TODO: Add a route to match with * for all other paths */}
          {/* <Route path="*" element={?} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default CrowdbopApp;
