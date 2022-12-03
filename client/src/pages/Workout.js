import React, {useEffect, useState} from 'react'
import { useHistory } from 'react-router-dom'
import { decodeToken } from "react-jwt";
import {Navbar, Container, Button, Form, Card, Modal} from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid';



export default function Workout() {
    const history = useHistory()
    const token = localStorage.getItem('jwtToken')


    const[username, setUsername] = useState('')

    const[workouts, setWorkouts] = useState([])

    //name of workout
    const [name, setName] = useState('')
    const [day, setDay] = useState('')

    async function populateWorkout() {
        const req = await fetch('http://localhost:5000/workouts/get', {
			headers: {
				'username': localStorage.getItem('username'),
			},
		})

		const data = await req.json()
		if (data.status === 'ok') {
            setWorkouts(data.workouts)
		} else {
			alert(data.error)
		}
        return;
    }

    useEffect(() => {
        const token = localStorage.getItem('jwtToken')
        const username = localStorage.getItem('username')
        if(token) {
            setUsername(username)
            if (username === null) {
                localStorage.removeItem('jwtToken')
                history.push('/login')
            }
            else {
                populateWorkout();
            }
        }
        else{
            history.push('/login')
        }
    }, [])

    function logOff(){
        localStorage.removeItem('jwtToken')
        localStorage.removeItem('username')
        history.push('/')
    }

    async function addWorkout(event) {
        event.preventDefault();
        const id = uuidv4();
        const response = await fetch('http://localhost:5000/workouts/create', {
            method:'POST',
            headers: {
				'Content-Type': 'application/json',
                'username': username,
                
			},
            body: JSON.stringify({
                name: name,
                day: day,
                id: id
            }),
        })
        const data = await response.json()

        if(data.status === 'error') {
            console.log('reached')
        }
        else {
            console.log('tes')
            let newWorkout = {name: name, day: day, username: username, id:id};
            if(workouts === undefined) {
                setWorkouts([newWorkout])
            }
            else {
                setWorkouts(prevState => [...prevState, newWorkout]);
            }
            
            alert('Workout added')
        }

    }

  return (
    <div>
        <Navbar bg="primary" expand="lg">
            <Container className="justify-content-center">
                <Navbar.Brand className='text-white'>Welcome !</Navbar.Brand>
            </Container>
            <Button variant="danger" onClick={logOff}>Log Off</Button>
        
        </Navbar>
        <Form onSubmit={addWorkout}>
            <Form.Group className="mb-3">
                <Form.Label>Workout Name</Form.Label>
                <Form.Control className="position-relative" type="text" placeholder="Enter Name" onChange={(e) => setName(e.target.value)} required/>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Day of Workout</Form.Label>
                <Form.Control className="position-relative" type="text" placeholder="Enter Day of Workout" onChange={(e) => setDay(e.target.value)} required/>
            </Form.Group>
            <Button variant="primary" type="submit" className="mb-3">
            Add Budget
            </Button>
  
        </Form>

        {workouts.map(d => (
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                <Card.Title>{d.name}</Card.Title>
                <Card.Text className="me-3">
                {d.day} 
                 </Card.Text>

                </Card.Body>
            </Card>
        ))}


    </div>
    
  )
}
