import React from 'react'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import About from './pages/About'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import Residents from './pages/Residents'
import FamilyRecords from './pages/FamilyRecords'
import { useSelector} from 'react-redux';
import PrivateRoute from './components/PrivateRoutes'
import Page404 from './pages/Page404'

export default function App() {
  const { currentUser } = useSelector((state) => state.user);
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
        <Route path="/family-records" element={<FamilyRecords />} />
      </Route>  

      <Route path="/*" element={<Page404 />} />
      </Routes>
    
    </BrowserRouter>
  )
}
