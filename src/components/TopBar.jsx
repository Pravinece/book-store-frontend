import { ChartBarDecreasing, Home, LogIn, LogOut, UserCheck2 } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import Button from './Button'
import { useLocation, useNavigate } from 'react-router-dom';

function TopBar() {
  const env = import.meta.env
  const location = useLocation();
  const navigate = useNavigate();
  let [indicator , setIndicator] = useState(null)
  console.log('indicator: ', indicator);
  let navRef = useRef(null)
  let itemsRef = useRef([])

  const navItems = [
    { id: 1, path: "", icon: Home, label: "Home", visible: true },
    { id: 2, path: "dashboard", icon: ChartBarDecreasing, label: "Dashboard", visible: true },
    { id: 3, path: "about", icon: UserCheck2, label: "About Us", visible: true },
  ];

  const isActive = (item) => {
    const path = location.pathname.replace(/\/$/, "");
    if (item.path === "") return path === "" || path === "/";
    return path === "/" + item.path || path.startsWith("/" + item.path + "/");
  };

  const handleNavigation = (path, index) => {
    const el = itemsRef.current[index];
    const nav = navRef.current;
    if (!el || !nav) return;
    const navLeft = nav.getBoundingClientRect().left;
    const elRect = el.getBoundingClientRect();
    console.log('elRect.left: ', elRect.left);
    setIndicator({ left: elRect.left - navLeft, width: elRect.width });
    navigate(path)
  }

  useEffect(() => {
    if (itemsRef.current[0] && navRef.current) {
      const elRect = itemsRef.current[0].getBoundingClientRect();
      const navLeft = navRef.current.getBoundingClientRect().left;
      setIndicator({ left: elRect.left - navLeft, width: elRect.width });
    }
  }, []);

  return (
    <div className='w-full h-[70px]'>
      <div className='w-[90%] h-full mx-auto flex justify-between items-center m-2 px-5 rounded-4xl border-2 border-neutral-100 bg-white shadow-2xl'>
        <div className='w-[100px] h-full p-1'>
          <img src={`${env.VITE_APP_URL}/brandLogo.png`} className='w-full h-full object-contain' alt="" />
        </div>


        <div className='relative flex justify-center items-center gap-3 px-1 h-[55px] rounded-4xl border-4 border-neutral-200 bg-white shadow-2xl' ref={navRef}>
        {indicator && <div style={indicator} className="absolute z-1 w-20 left-0 h-8 rounded-4xl bg-blue-100 transition-all duration-300 ease-in-out"></div>}
          {navItems.map((tab) => {
            const active = isActive(tab)
            return(
            <button key={tab.id}
              onClick={() => handleNavigation(tab.path, navItems.indexOf(tab))}
              ref={(el) => (itemsRef.current[navItems.indexOf(tab)] = el)} 
              className='cursor-pointer text-[14px] w-20 h-8 text-neutral-500 border rounded-4xl  hover:text-blue-400'>
              {tab.label}
            </button>)}
          )}
        </div>


        <Button className='w-[100px] h-[40px] rounded-4xl border-2 border-neutral-200 bg-white text-blue-400 text-[14px]'>
          <span className='flex justify-center items-center gap-2 cursor-pointer '>
            <LogIn className='w-4' />
            Login
          </span>
        </Button>
      </div>
        
    </div>
  )
}

export default TopBar