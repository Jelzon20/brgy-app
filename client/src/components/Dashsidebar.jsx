import { Sidebar } from 'flowbite-react';
import {
  HiUser,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function DashSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              active={tab === 'profile'}
              icon={HiUser}
            //   label={currentUser.isAdmin ? 'Admin' : 'User'}
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>

          <Link to='/dashboard?tab=addResident'>
            <Sidebar.Item
              active={tab === 'addResident'}
            //   icon={HiUser}
              labelColor='dark'
              as='div'
            >
              Add Resident
            </Sidebar.Item>
          </Link>
          
          <Link to='/dashboard?tab=addFamilyRecord'>
            <Sidebar.Item
              active={tab === 'addFamilyRecord'}
            //   icon={HiUser}
              labelColor='dark'
              as='div'
            >
              Add family Record
            </Sidebar.Item>
          </Link>
          
         
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}