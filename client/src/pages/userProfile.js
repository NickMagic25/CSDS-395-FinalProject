import React, {useEffect, useState} from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import {ProfileInfo} from "../Components/profileInfo/ProfileInfo";
import Navbar from "../Components/navbar/Navbar";
import axios from "axios";

var staticSquat = 0, staticBench = 0, staticDeadlift = 0, staticWeight = 0;

export default function UserProfile(props) {
    const history = useHistory()
    const token = localStorage.getItem('jwtToken')
    const location = useLocation();

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userName, setUserName] = useState("")
  const [deadlift, setDeadlift] = useState(0)
  const [bench, setBench] = useState(0)
  const [squat, setSquat] = useState(0)
  const [weight, setWeight] = useState(0)
    const[onUser, setOnUser] = useState(false);
    const[followed, setFollowed] = useState(false);

    async function getFollowedUser(currentProfile) {
        const req = await fetch('http://localhost:5000/api/isFriend/' + currentProfile , {
            headers: {
				'username': localStorage.getItem('username'),
			},
        })
        const data = await req.json();
        //0 is false, 1 is true
        if (data.status === 'ok') {
            var followedOrNo = data.isFriend[0].r;
            if (followedOrNo == 0){
                setFollowed(false);
            }
            else if (followedOrNo == 1){
                setFollowed(true);
            }
        }
        return;
    }

  async function getProfileInfo() {
    if (userName != null){
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
        console.log(data.profile[0].weight);
        if (data.profile[0].bench == null){
            setBench(0);
        }
        else {
            setBench(data.profile[0].bench);
            staticBench = data.profile[0].bench
        }
        if (data.profile[0].deadlift == null){
            setDeadlift(0);
        }
        else {
            setDeadlift(data.profile[0].deadlift);
            staticDeadlift = data.profile[0].deadlift
        }
        if (data.profile[0].squat == null){
            setSquat(0);
        }
        else {
            setSquat(data.profile[0].squat);
            staticSquat = data.profile[0].squat;
        }
        if (data.profile[0].weight == null){
            setWeight(0);
        }
        else {
            setWeight(data.profile[0].weight);
            staticWeight = data.profile[0].weight;
        }
    }
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
                setUserName(location.state);
                getFollowedUser(location.state);
                getProfileInfo();
                console.log(followed);
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
        getFollowedUser(userName);
        console.log(followed);
        getProfileInfo();
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
        
        setFollowed(true);
        //const data = await req.json()
        // if (data.status === 'ok') {
        //     console.log("added");
        // } else {
        //     alert(data.error)
        // }
        // return;
    }

    async function unfollow() {
        const req = await axios.post('http://localhost:5000/api/removeFriend', {
			headers: {
				'username': localStorage.getItem('username'),
			},
            body: {
                "target" : userName,
            }
		})
        setFollowed(false);
    }

    async function updateLift(event) {
        event.preventDefault();
        const response = await fetch('http://localhost:5000/api/updateUser', {
            method:'POST',
            headers: {
				'Content-Type': 'application/json',
                'username': localStorage.getItem('username'),
			},
            body: JSON.stringify({
                bench: parseInt(bench),
                deadlift: parseInt(deadlift),
                squat: parseInt(squat),
                weight: parseInt(weight),
            }),
        })
    }

  return (
    <>
    <div>
        <Navbar changeUserName={setUserName}/>
        <div className="userProfile">
        {!onUser && !followed && 
            <button onClick={follow}>Follow</button>
        }
        {!onUser && followed && 
            <button onClick={unfollow}>Unfollow</button>
        }
        
        
        <div className="firstName">{firstName}</div>
        <div className="lastName">{lastName}</div>
        <div className="userName">{userName}</div>
        <div className='oneRepMax'>
            <div className="deadlift">
                Max Deadlift: {staticDeadlift}
            </div>
            <div className="bench">
                Max Bench: {staticBench}
            </div>
            <div className="squat">
                Max Squat: {staticSquat}
            </div>
        </div>
        <div className="weight">
            Current Weight: {staticWeight} (in lbs)
        </div>
        <br />
        <br />
        {onUser && 
        <div className="updateLifts">
            Update Info
            <form onSubmit={updateLift}>
                <label for="bench">Bench:</label>
                <input type="number" id="bench" name="bench" min="0" value={bench} onChange={(e) => setBench(e.target.value)}/><br/><br/>
                <label for="deadlift">Deadlift:</label>
                <input type="number" id="deadlift" name="deadlift" min="0" value={deadlift} onChange={(e) => setDeadlift(e.target.value)}/><br/><br/>
                <label for="squat">Squat:</label>
                <input type="number" id="squat" name="squat" min="0" value={squat} onChange={(e) => setSquat(e.target.value)}/><br/><br/>
                <label for="weight">Weight:</label>
                <input type="number" id="weight" name="weight" min="0" value={weight} onChange={(e) => setWeight(e.target.value)}/><br/><br/>
                <input type="submit" value="Submit"/>
            </form>
        </div>
        }
    </div>
    </div>
    </>
    
  )
}
