import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/Dashsidebar';
import DashProfile from '../components/DashProfile';
import DashAddResident from '../components/DashAddResident';
import DashAddFamilyRecord from '../components/DashAddFamilyRecord';


export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === 'profile' && <DashProfile />}
      {tab === 'addResident' && <DashAddResident />}
      {tab === 'addFamilyRecord' && <DashAddFamilyRecord />}
    

    </div>
  );
}