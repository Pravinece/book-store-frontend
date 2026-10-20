import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopBar from "../../components/TopBar";
function Hero() {
    const location = useLocation();
    let [showBar, setShowBar] = useState(true)

  useEffect(()=>{
    const path = location.pathname.split('/');
    if (path.includes("adminpanel")) setShowBar(false);
    else if(!showBar) setShowBar(true);
  },[location.pathname])

  return (
    <main className="full h-full flex flex-col justify-center items-center bg-neutral-100">
        {showBar && <TopBar />}
        <div className={`w-full h-[calc(100vh-70px)] max-h-[calc(100vh-70px)] ${!showBar && 'min-h-[calc(100vh-10px)]'} flex justify-center items-center`}>
          <Outlet />
        </div>
    </main>
  );
}

export default Hero;