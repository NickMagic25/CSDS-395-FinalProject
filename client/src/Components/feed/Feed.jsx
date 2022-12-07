import "./feed.css";
import Write from "../write/Write"
import React, {useEffect, useState, useReducer} from 'react'
import {Link} from 'react-router-dom'
import {Navbar, Container, Button, Form, Card, Modal} from 'react-bootstrap'


export default function Feed() {
  const [posts, setPosts] = useState([])

  const [workid, setWorkid] = useState('')
  const [workoutName, setWorkoutName] = useState('')
  const [exercises, setExercises] = useState([])
  const [showWork, setShowWork] = useState(false)

  function handleCloseW() {
    setShowWork(false)
  }

  function refresh(newPost) {
    console.log('reached')
    if(posts === undefined) {
      setPosts([newPost])
    }
    else {
        setPosts(prevState => [newPost, ...prevState]);
    }
  }


  async function populateFeed() {
    const req = await fetch('http://localhost:5000/api/getPosts', {
			headers: {
				'username': localStorage.getItem('username'),
			},
		})

		const data = await req.json()
		if (data.status === 'ok') {
            setPosts(data.posts)
		} else {
			alert(data.error)
		}
        return;
  }

  async function viewWorkout(id) {
    setWorkid(id)
    const req = await fetch('http://localhost:5000/workouts/' + id, {
			headers: {
				'username': localStorage.getItem('username'),
			},
		})

		const data = await req.json()
		if (data.status === 'ok') {
            setExercises(data.exercises)
            setShowWork(true)
		} else {
			alert(data.error)
		}

  }

    useEffect(() => {
      const username = localStorage.getItem('username')
      populateFeed();
      return;
  }, [])

  return (
    <div className="feed">
        <div className="feedWrapper">
            <Write refresh={refresh}/>
        </div>
        {posts.map(d => (
          <div className="post">
          <div className="postWrapper">
            <div className="postTop">
              <div className="postTopLeft">
                <img
                  className="postProfileImg"
                  src ="/assets/person.jpg"
                  alt=""
                />
                <span className="postUsername">
                  {d.user_name}
                </span>
                <span className="postDate">{d.created_at}</span>
              </div>
              {/* <div className="postTopRight">
                <MoreVert />
              </div> */}
            </div>
            <div className="postCenter">
              <span className="postText">{d.message}</span>
              {d.workout_id != null && 
              <>
            <button onClick={() => viewWorkout(d.workout_id)}>View Workout</button>
            <Modal show={showWork} onHide={handleCloseW}>
                    <Modal.Header closeButton>
                    <Modal.Title>{workoutName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    {exercises.map(f => (
                        <li>{f.move_name} {f.repetition} x {f.rep_count} reps</li>
                    ))}
                        
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseW}>
                        Close
                    </Button>
                    
                    </Modal.Footer>
            </Modal>
            </>

              }
            </div>
            {/* <div className="postBottom">
              <div className="postBottomLeft">
                <img className="likeIcon" src="assets/like.png"  alt="" />
                <span className="postLikeCounter">{like} people like it</span>
              </div>
              <div className="postBottomRight">
                <span className="postCommentText">{post.comment} comments</span>
              </div>
            </div> */}
          </div>
        </div>

        ))}
    </div>
  )
}
