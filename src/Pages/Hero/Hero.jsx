import React from "react";
import { Outlet } from "react-router-dom";
function Hero() {
  return (
    <main className="full h-full flex justify-center items-center">
        <Outlet />
    </main>
  );
}

export default Hero;
