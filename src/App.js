import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import supabase from './supabase';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import ContactForm from './pages/ContactForm';
import AdminSmspin from './pages/AdminSmspin';
import InfoTree from './pages/InfoTree';
import TreeInfo from './pages/TreeInfo';
import AddTree from './pages/AddTree';
import AboutUs from './pages/AboutUs';
import TreeForm from './adminside/TreeForm';
import Home from './adminside/Home';
import Tree from './adminside/Tree';
import AdminPinStatus from './adminside/AdminPinStatus';
import AdminReport from './adminside/AdminReport';
import AdminMap from './adminside/AdminMap';
import AdminUserList from './adminside/AdminUserList';
import AdminFaqs from './adminside/AdminFaqs';
import AdminFeedback from './adminside/AdminFeedback';
import BlogSlider from './pages/Blog/BlogSlider';
import Feedback from './pages/Feedback';
import LandingPageMap from './pages/LandingPageMap';
import BlogPost from './pages/Blog/BlogPost'
import BlogModal from './pages/Blog/BlogModal'
import { useAuth } from './AuthContext';


function App() {
  const { user, signIn, signOut, isAdmin, setUser } = useAuth();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Admin" element={<AdminDashboard />} />
        <Route path="/AuthPage" element={user ? <Navigate to="/" replace={true} /> : <AuthPage />} />
        <Route path="/ContactForm" element={<ContactForm />} />
        <Route path="/AdminSmspin" element={<AdminSmspin />} />
        <Route path="/InfoTree" element={<InfoTree />} />
        <Route path="/TreeInfo" element={<TreeInfo />} />
        <Route path="/AddTree" element={user ? <AddTree /> : <Navigate to="/AuthPage" replace={true} />} />
        <Route path="/AboutUs" element={<AboutUs />} />
        {user && isAdmin && (
          <>
            <Route path="/TreeForm" element={<TreeForm />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Tree" element={<Tree />} />
            <Route path="/AdminPinStatus" element={<AdminPinStatus />} />
            <Route path="/AdminMap" element={<AdminMap />} />
            <Route path="/AdminUserList" element={<AdminUserList />} />
            <Route path="/AdminReport" element={<AdminReport />} />
            <Route path="/AdminFaqs" element={<AdminFaqs />} />
            <Route path="/AdminFeedback" element={<AdminFeedback />} />
          </>
        )}
        <Route path="/BlogSlider" element={<BlogSlider />} />
        <Route path="/Feedback" element={<Feedback />} />
        <Route path="/LandingPageMap" element={<LandingPageMap />} />
        <Route path="/BlogPost" element={<BlogPost />} />
        <Route path="/BlogModal" element={<BlogModal />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
