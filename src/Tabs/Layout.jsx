// src/Tabs/layout.jsx
import { Outlet, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';


export default function Layout() {
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserDetails(user);
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [navigate]);

  const tabs = [
    { to: '/Home', icon: 'bi-house-fill', label: 'Home' },
    { to: '/Rides', icon: 'bi-car-front-fill', label: 'Rides' },
    { to: '/Chats', icon: 'bi-chat-dots-fill', label: 'Chats' },
    { to: '/Profile', icon: 'bi-person-fill', label: 'Profile' },
  ];

  return (
    <div className="flex flex-col h-screen">
      <div>
        {userDetails ? (
          <div className="container-fluid">
            <div className="row bg-warning p-1 mb-3 align-items-center justify-content-between">

              <div className="col-6 col-md-auto">
                <h2 className="mb-0">Welcome</h2>
                <p className="mb-0" style={{ fontSize: '14px' }}>Email: {userDetails.email}</p>
              </div>
              <div className="col-12 col-md-auto text-center mt-3 mt-md-0">
                <h1 className="mb-0">Uber Clone - Cab Share</h1>
              </div>
              <div className="col-12 col-md-auto text-end mt-3 mt-md-0">
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <main className="flex-grow overflow-auto">
        <Outlet />
        
      </main>
      <nav className="h-16 bg-white border-t flex justify-around items-center">
        {tabs.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center text-sm ${isActive ? 'text-blue-600' : 'text-gray-500'
              }`
            }
          >
            <i className={`bi ${icon} text-2xl`} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
