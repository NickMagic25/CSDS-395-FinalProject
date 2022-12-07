import "./navbar.css"
import { Link, useHistory, useLocation } from "react-router-dom";
import React, {useEffect, useState} from 'react'
import {changeUserName} from "../../pages/userProfile"
export default function Navbar({changeUserName}) {
    const history = useHistory();
    const l = useLocation();

    const [searchBar, setSearchBar] = useState("");

    function logoff() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        history.push('/login');
    }

    function viewProfile() {
        history.push({pathname: '/userProfile', state: localStorage.getItem('username')});
    }

    function searchFriend(event) {
        //pass serach bar 
        console.log(searchBar);
        history.push({
            pathname: '/userProfile',
            state: searchBar
        })
        if(window.location.pathname === "/userProfile") {
            changeUserName(searchBar)
        }
        event.preventDefault();
    }

    return (
        <div className="navbarContainer">
            <div className="navbarLeft">
                <span className="logo">InstaJacked</span>
            </div>
            <div className="navbarCenter">
                <div className="searchbar">
                    <form onSubmit={searchFriend}>
                        <input placeholder="Search for friends, workouts, and posts" className="searchInput" onChange={(e) => setSearchBar(e.target.value)}/>
                        <button type="submit"></button>
                    </form>
                </div>
            </div>
            <div className="navbarRight">
                <Link to="/workout" className="navbarLink">My Workouts</Link>
                <Link to="/friends" className="navbarLink">Friends</Link>
            </div>
            <div className="navbarIcons">
                <form onSubmit={viewProfile}>
                    <button><img style={{"height":"30px", "width": "30px"}} src ="/assets/person.jpg"/></button>
                </form>
            </div>
            <button onClick={logoff}>
                Log Off
            </button>
              
        </div>
    )

}