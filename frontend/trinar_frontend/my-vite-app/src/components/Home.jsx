//src/components/Home.js

import React from "react";
import Sidebar from "./Sidebar";
import NavBar from "./NavBar";
import PostField from "./PostField";
import Timeline from "./Timeline";
import "./Home.css";

const Home = () => {
  return (
    <div>
      <NavBar />
      <Sidebar />
      <div className="home-content">
        <PostField />
        <Timeline />
      </div>
    </div>
  );
};

export default Home;
