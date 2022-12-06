import "./profileInfo.css";
import React, {useEffect, useState} from 'react'


export function ProfileInfo() {
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
        setFirstName(data.firstName);
        setLastName(data.setLastName);
        setUserName(data.userName);
    } else {
        alert(data.error)
    }
    return;
  }

    useEffect(() => {
      const username = localStorage.getItem('username')
      getProfileInfo();
      return;
  }, [])

  return (
    <div className="userProfile">
        <div className="firstName">{firstName}</div>
        <div className="lastName">{lastName}</div>
        <div className="userName">{userName}</div>
    </div>
  )
}
