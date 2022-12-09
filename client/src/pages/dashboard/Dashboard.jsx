import Navbar from "../../Components/navbar/Navbar";
import Feed from "../../Components/feed/Feed";
import Pbbar from "../../Components/pbbar/Pbbar";
import "./dashboard.css";
import React, {useEffect, useState} from 'react'
import { useHistory } from 'react-router-dom'



export default function Dashboard() {
  const history = useHistory();
    useEffect(() => {
      const token = localStorage.getItem('jwtToken')
      const username = localStorage.getItem('username')
      if(token) {
          if (username === null) {
              localStorage.removeItem('jwtToken')
              history.push('/login')
          }
          else {
              return;
          }
      }
      else{
          history.push('/login')
      }
  }, [])

  return (
    <>
        <Navbar />
        <div className="dashboardContainer">
          <Feed />
        </div>
    </>
  );
};
