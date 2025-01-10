import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Navbar from "./Navbar";

import '../App.css';
import NewsSection from "./NewsSection";
import CategoryPage from "./CategoryPage";
import Footer from "./Footer";
import LoginPage from "./LoginPage"
import SignupPage from "./SignupPage";

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          
          {/* Define the /news route and handle the redirect to /news/all */}
          <Route path="/news" element={<NewsSection />}>
            <Route index element={<Navigate to="/news/all" replace />} />
            <Route path=":category" element={<CategoryPage />} /> {/* This will match /news/:category */}
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Router>
      <Footer/>
    </div>
  );
}

export default App;
