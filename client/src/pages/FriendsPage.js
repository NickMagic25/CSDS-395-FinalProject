import React, {useEffect, useState} from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Navbar from "../Components/navbar/Navbar";
import axios from "axios";
import {Table} from 'react-bootstrap'


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
        <div>
            <Navbar />
            <div className="friends">
            <h1>Following List </h1>


            <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                        <th>Friend's Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Bench</th>
                        <th>Deadlift</th>
                        <th>Squat</th>
                        <th>Bodyweight</th>
                        </tr>
                    </thead>
                    <tbody>   
                {friends.map(d => (
                <tr>
                    <td>{d.target_user}</td>
                    <td>{d.first_name}</td>
                    <td>{d.last_name}</td>
                    <td>{d.bench == null? 0:d.bench}</td>
                    <td>{d.deadlift == null? 0:d.deadlift}</td>
                    <td>{d.squat == null? 0:d.squat}</td>
                    <td>{d.weight == null? 0:d.weight}</td>
                </tr>
                ))}
                </tbody>
                </Table>
            </div>
        </div>
      )
}