import React from "react";
import { Outlet } from "react-router-dom";

function CrowdbopLayout(props) {
    return (
        <div>
            {/* Create a navbar here! */}
            <Outlet />
        </div>
    );
}

export default CrowdbopLayout;