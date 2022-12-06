import React, {useEffect, useState} from 'react'
import { useHistory } from 'react-router-dom'
import {ProfileInfo} from "../Components/profileInfo/ProfileInfo";
import Navbar from "../Components/navbar/Navbar";
export default function UserProfile() {
    const history = useHistory()
    const token = localStorage.getItem('jwtToken')

    const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userName, setUserName] = useState("")

  async function getProfileInfo() {
    const req = await fetch('http://localhost:5000/api/getUser/bjin', {
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
                getProfileInfo();
                return;
            }
        }
        else{
            history.push('/login')
        }
    }, [])

    

  return (
    <>
    <div>
        <Navbar />
        <div className="userProfile">
        <button>Follow</button>
        <div className="firstName">{firstName}</div>
        <div className="lastName">{lastName}</div>
        <div className="userName">{userName}</div>
    </div>
    </div>
    </>
    
  )
}
