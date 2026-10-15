import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../../components/TopBar";
function Hero() {
  return (
    <main className="full h-full flex flex-col justify-center items-center">
        <TopBar />
        <div className="w-full min-h-[calc(100vh-70px)] h-full flex justify-center items-center">
          <Outlet />
        </div>
    </main>
  );
}

export default Hero;