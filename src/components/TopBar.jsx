import { ChartBarDecreasing, Home, LogIn, LogOut, User, UserCheck2 } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import Button from './Button'
import { useLocation, useNavigate } from 'react-router-dom';
import { clearAuth, getSecureUser } from '../utils/cookieAuth';
import { logOutUser } from '../app/api/authapi';

function TopBar() {
  const env = import.meta.env
  const location = useLocation();
  const navigate = useNavigate();
  let [indicator , setIndicator] = useState(null)
  let navRef = useRef(null)
  let itemsRef = useRef([])

  let user = getSecureUser();

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
    setIndicator({ left: (elRect.left - navLeft -4), width: elRect.width });
    navigate(path)
  }

  useEffect(() => {
    const activeIndex = navItems.findIndex((item) => isActive(item));
    const idx = activeIndex === -1 ? 0 : activeIndex;
    const el = itemsRef.current[idx];
    const nav = navRef.current;
    if (!el || !nav) return;
    const navLeft = nav.getBoundingClientRect().left;
    const elRect = el.getBoundingClientRect();
    setIndicator({ left: (elRect.left - navLeft - 4), width: elRect.width });
  }, [location.pathname]);

  const handleLogout = async () => {
    const res = await logOutUser();
    if (res.success) {
      clearAuth();
    } else {
      console.error('Logout failed:', res.message);
    }
  }

  return (
    <div className='w-full h-[70px] z-100'>
      <div className='w-[90%] h-full mx-auto flex justify-between items-center mt-1 px-5 rounded-4xl border-2 border-neutral-100 bg-white shadow-2xl'>
        <div className='w-[100px] h-full p-1'>
          <img src={`./brandLogo.png`} className='w-full h-full object-cover' alt="" />
        </div>


        <div className='relative flex justify-center items-center gap-3 px-2 h-[55px] rounded-4xl border-4 border-neutral-200 bg-white shadow-2xl' ref={navRef}>
        {indicator && <div style={indicator} className="absolute z-1 w-7 sm:w-20 left-0 h-8 clay-box-shadow transition-all duration-300 ease-in-out"></div>}
          {navItems.map((tab) => {
            const active = isActive(tab)
            return(
            <button key={tab.id}
              onClick={() => handleNavigation(tab.path, navItems.indexOf(tab))}
              ref={(el) => (itemsRef.current[navItems.indexOf(tab)] = el)} 
              className='cursor-pointer outline-none z-10 text-[14px] w-7 sm:w-20 h-8 flex justify-center items-center text-secondary rounded-4xl hover:text-secondary'>
              <span className='hidden sm:inline'>{tab.label}</span>
              <span className='sm:hidden'><tab.icon size={15} /></span>
            </button>)}
          )}
        </div>


          {user ? (
            <Button onClick={() => {handleLogout()}} className='w-[40px] sm:w-[100px] h-[40px] rounded-4xl border-2 border-neutral-200 bg-secondary text-accent text-[14px]'>
              <span className='flex justify-center items-center gap-2 cursor-pointer'>
                <User className='w-4' />
                <span className='hidden sm:inline'>Logout</span>
              </span>
            </Button>
          ) : (
            <Button onClick={() => navigate('login')} className='w-[40px] sm:w-[100px] h-[40px] rounded-4xl border-2 border-neutral-200 bg-secondary text-accent text-[14px]'>
              <span className='flex justify-center items-center gap-2 cursor-pointer'>
                <LogIn className='w-4' />
                <span className='hidden sm:inline'>Login</span>
              </span>
            </Button>
          )}
      </div>
        
    </div>
  )
}

export default TopBar