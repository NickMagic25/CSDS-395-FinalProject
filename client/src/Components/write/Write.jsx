import "./write.css";
import React, {useEffect, useState} from 'react'
import { v4 as uuidv4 } from 'uuid';


export default function Write({refresh}) {
    const username = localStorage.getItem('username');
    const [text, setText] = useState('')

    async function post() {
        const id = uuidv4();
        const response = await fetch('http://localhost:5000/api/makePost', {
            method:'POST',
            headers: {
				'Content-Type': 'application/json',
                'username': username,
                
			},
            body: JSON.stringify({
                postID: id,
                text: text,
                workoutID: null,
            }),
        })
        const data = await response.json()

        if(data.status === 'error') {
            console.log('reached')
        }
        else {
            alert('posted')
            setText('')
            const newPost = {post_id: id, user_name: username, message:text, created_at: "Less than a min ago..."}
            refresh(newPost);
            return;
        }

    }

  return (
    <div className="write">
        <div className="writeWrapper">
            <div className="writeTop">
                
                <img src="/assets/person.jpg" alt="" className="shareProfileImg" /> 
                <input onChange={(e) => setText(e.target.value)} value={text} type="text" className="writeInput" placeholder="Say What's Up"/>
            </div>
            <hr className="shareHr" />
            <div className="writeBottom">
                <div className="shareOptions">
                    <div className="shareOption">
                        <span className="shareOptionText">Photo or Video</span>
                    </div>

                    <div className="shareOption">
                        <span className="shareOptionText">Workouts</span>
                    </div>

                    <div className="shareOption">
                        <span className="shareOptionText">Location</span>
                    </div>
                    
                </div>
                <button className="shareButton" onClick={post}> Share </button>
            </div>
        </div>
    </div>
  )
}
