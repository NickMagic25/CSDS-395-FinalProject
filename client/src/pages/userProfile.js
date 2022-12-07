import React, {useEffect, useState} from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import {ProfileInfo} from "../Components/profileInfo/ProfileInfo";
import Navbar from "../Components/navbar/Navbar";
import axios from "axios";

export default function UserProfile(props) {
    const history = useHistory()
    const token = localStorage.getItem('jwtToken')
    const location = useLocation();

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userName, setUserName] = useState("")
    const[onUser, setOnUser] = useState(false);

  async function getProfileInfo() {
    console.log(userName);
    const req = await fetch('http://localhost:5000/api/getUser/' + userName, {
			headers: {
				'username': localStorage.getItem('username'),
			},
		})
    const data = await req.json()
    if (data.status === 'ok') {
        setFirstName(data.profile[0].first_name);
        setLastName(data.profile[0].last_name);
        setUserName(data.profile[0].user_name);
    } else {
        alert(data.error)
    }
    return;
    }

    useEffect(() => {
        const token = localStorage.getItem('jwtToken')
        const username = localStorage.getItem('username')
        if(token) {
            if (username === null) {
                localStorage.removeItem('jwtToken')
                history.push('/login')
            }
            else {
                setUserName(location.state)
                
            }
        }
        else{
            history.push('/login')
        }
    }, [])

    useEffect(() => {
        if(localStorage.getItem('username') === userName) {
            setOnUser(true);
        }
        else {
            setOnUser(false);
        }
        getProfileInfo()
                return;
        
    }, [userName])

    
    async function follow() {
        const req = await axios.post('http://localhost:5000/api/addFriend', {
			headers: {
				'username': localStorage.getItem('username'),
			},
            body: {
                "target" : userName,
            }
		})
        console.log(req);
        //const data = await req.json()
        // if (data.status === 'ok') {
        //     console.log("added");
        // } else {
        //     alert(data.error)
        // }
        // return;
    }

  return (
    <>
    <div>
        <Navbar changeUserName={setUserName}/>
        <div className="userProfile">
        {!onUser && 
            <button onClick={follow}>Follow</button>
        }
        
        
        <div className="firstName">{firstName}</div>
        <div className="lastName">{lastName}</div>
        <div className="userName">{userName}</div>
    </div>
    </div>
    </>
    
  )
}
