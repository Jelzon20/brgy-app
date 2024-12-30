import React from 'react'
import { BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom'
import { useEffect, useState } from 'react'
import About from './pages/About'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import Residents from './pages/Residents'
import { useSelector} from 'react-redux';
import PrivateRoute from './components/PrivateRoutes'
import { useDispatch } from 'react-redux';
import Page404 from './pages/Page404'
import {
  signoutSuccess
} from '../redux/user/userSlice';
import Documents from './pages/Documents'

export default function App() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch()
    // const navigate = useNavigate();

  const handleSignout = async () => {
      try {
        const res = await fetch('/api/auth/signout', {
          method: 'POST',
        });
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
          dispatch(signoutSuccess());
          localStorage.removeItem('expiresIn');
          // navigate('/signin');
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const checkForInactivity = () => {
      const expireTime = localStorage.getItem('expiresIn');
     if (expireTime < Date.now()) {
      handleSignout();
     }
    }
  
    const updateExpireTime = () => {
      const expireTime = Date.now() + 3600000;
      localStorage.setItem('expiresIn', expireTime);
    }
  
    useEffect(() => {
      const interval = setInterval(() => {
        checkForInactivity();
      }, 1000);
  
      return () => {
        clearInterval(interval);
      }
    }, []);
  
    useEffect(() => {
      updateExpireTime();
  
      window.addEventListener('click', updateExpireTime);
      window.addEventListener('keypress', updateExpireTime);
      window.addEventListener('scroll', updateExpireTime);
      window.addEventListener('mousemove', updateExpireTime);
  
      return () => {
        window.addEventListener('click', updateExpireTime);
        window.addEventListener('keypress', updateExpireTime);
        window.addEventListener('scroll', updateExpireTime);
        window.addEventListener('mousemove', updateExpireTime);
      }
    }, []);
  
  return (
    <BrowserRouter>
    {(currentUser) ? <Header /> : (<></>)}
    
      <Routes>
      <Route path="/signin" element={<SignIn />} />

      <Route element={<PrivateRoute />} >
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/residents" element={<Residents />} />
        <Route path="/documents" element={<Documents />} />
      </Route>  

      <Route path="/*" element={<Page404 />} />
      </Routes>
    
    </BrowserRouter>
  )
}
