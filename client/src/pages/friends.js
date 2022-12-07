import React, {useEffect, useState} from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Navbar from "../Components/navbar/Navbar";
import axios from "axios";

export default function friendsPage(props) {
    const history = useHistory();
    const [friends, setFriends] = useState([]);

    async function getFriends() {
        const req = await fetch('http://localhost:5000/api/getPosts', {
                headers: {
                    'username': localStorage.getItem('username'),
                },
            })
    
            const data = await req.json()
            if (data.status === 'ok') {
                setFriends(data.posts)
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
              <li>{d.message} {d.user_name} {d.created_at}</li>
    
            ))}
        </div>
      )
}