import "./feed.css";
import Write from "../write/Write"
import React, {useEffect, useState} from 'react'


export default function Feed() {
  const [posts, setPosts] = useState([])

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

    useEffect(() => {
      const username = localStorage.getItem('username')
      populateFeed();
      return;
  }, [])

  return (
    <div className="feed">
        <div className="feedWrapper">
            <Write />
        </div>
        {posts.map(d => (
          <li>{d.message} {d.user_name} {d.created_at}</li>

        ))}
    </div>
  )
}
