import React from "react";
import { Outlet } from "react-router-dom";
import CrowdbopBanner from "../content/CrowdbopBanner";

function CrowdbopLayout() {
  return (
    <div className="crowdbop-layout">
      <CrowdbopBanner />
      <Outlet />
    </div>
  );
}

export default CrowdbopLayout;
