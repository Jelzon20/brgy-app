import React from 'react'
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import webLogo from "../assets/abucayLogo.png";
import { useSelector, useDispatch } from 'react-redux';
import { signoutSuccess } from '../../redux/user/userSlice';


export default function Header() {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [hasToken, setHasToken] = useState(true);
   
  

    useEffect(()=> {
      handleCheckToken();
    }, []);
  
    const handleCheckToken = async () => {
      try {
        const res = await fetch('/api/auth/checkAuth', {
          method: 'GET',
        });
        const data = await res.json();
        if (data) {
          setHasToken(data.hasToken)
        } else {
          setHasToken(data.hasToken)
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    useEffect(()=> {
      if(!hasToken){
        handleSignout();
      }
    });
  
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
        navigate('/signin');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (

    <Navbar className='border-b-2'>
      <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
      >
        <img src={webLogo} alt="NCYM Logo" className='w-32' />
      </Link>
      <div className='flex gap-2 md:order-2'>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' 
            //   img={currentUser.profilePicture} 
              rounded />
            }
          >
            <Dropdown.Header>

              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>
            {/* {currentUser.isRegistered && ( */}
                <Link to={'/dashboard?tab=settings'}>
              <Dropdown.Item>Settings</Dropdown.Item>
            </Link>
            
           
            {/* )} */}
            <Dropdown.Divider />
            <Dropdown.Item 
            onClick={handleSignout}
            >Sign out</Dropdown.Item>
          </Dropdown>
     ) : (
          <></>
        )}
        <Navbar.Toggle />
      </div>

      {/* {currentUser && currentUser.isRegistered && ( */}
        <Navbar.Collapse>
        <Navbar.Link className='font-semibold' active={path === '/'} as={'div'}>
          <Link to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link className='font-semibold' active={path === '/residents'} as={'div'}>
          <Link to='/residents'>Residents</Link>
        </Navbar.Link>
        <Navbar.Link className='font-semibold' active={path === '/familyRecords'} as={'div'}>
          <Link to='/family-records'>Family records</Link>
        </Navbar.Link>
        
      </Navbar.Collapse>
      {/* )} */}

    </Navbar>
  )
}