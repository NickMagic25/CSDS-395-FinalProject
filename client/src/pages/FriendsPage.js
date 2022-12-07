import React, {useEffect, useState} from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Navbar from "../Components/navbar/Navbar";
import axios from "axios";

export default function FriendsPage(props) {
    const history = useHistory();
    const [friends, setFriends] = useState([]);

    async function getFriends() {
        const req = await fetch('http://localhost:5000/api/allFriends', {
                headers: {
                    'username': localStorage.getItem('username'),
                },
            })
            
            const data = await req.json()
            console.log(data);
            if (data.status === 'ok') {
                setFriends(data.friends)
            } else {
                alert(data.error)
            }
            return;
      }

    useEffect(() => {
        getFriends();
        return;
    }, [])

    return (
        <div className="friends">
            {friends.map(d => (
              <li>{d.target_user}</li>
    
            ))}
        </div>
      )
}