import React, {useEffect, useState} from 'react'
import { useHistory } from 'react-router-dom'
import { decodeToken } from "react-jwt";
import {Navbar, Container, Button, Form, Card, Modal} from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid';



export default function Workout() {
    const history = useHistory()
    const token = localStorage.getItem('jwtToken')

    //states for exercises
    const [eName, setEName] = useState('')
    const [set, setSet] = useState()
    const [rep, setRep] = useState()
    const [exercises, setExercises] = useState([])
    const [eWork, setEWork] = useState('')


    const[username, setUsername] = useState('')

    const[workouts, setWorkouts] = useState([])

    const [showE, setShowE] = useState(false)

    function handleCloseE() {
        setShowE(false);
    }

    function handleCloseW() {
        setShowWork(false);
    }

    function showAddExercise(id) {
        setShowE(true);
        setEWork(id);
    }

    function test() {
        console.log(eWork);
    }

    async function showWorkouts(id) {
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
            console.log(data.exercises)
		} else {
			alert(data.error)
		}
        return;
    }

    async function shareWorkouts(id, name) {
        console.log('reached')
        const pId = uuidv4();
        setWorkid(id)
        const req = await fetch('http://localhost:5000/api/makePost',{
            method:'POST',
			headers: {
                'Content-Type': 'application/json',
				'username': localStorage.getItem('username'),
			},
            body: JSON.stringify({
                postID: pId,
                text: "I just completed my " + name +" workout!",
                workoutID: "'"+ id + "'",
            }),
		})

		const data = await req.json()
		if (data.status === 'ok') {
            alert('shared')
		} else {
			alert(data.error)
		}
        return;
    }

    //name of workout
    const [name, setName] = useState('')
    const [day, setDay] = useState('')


    //states for view workout modal
    const [workid, setWorkid] = useState('')
    const [showWork, setShowWork] = useState(false)

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
            let newWorkout = {name: name, day: day, creator_user_name: username, workout_id:id};
            if(workouts === undefined) {
                setWorkouts([newWorkout])
            }
            else {
                setWorkouts(prevState => [...prevState, newWorkout]);
            }
            
            alert('Workout added')
        }

    }

    async function addExercise(event) {
        event.preventDefault();
        const eId = uuidv4();
        const response = await fetch('http://localhost:5000/api/addSet', {
            method:'POST',
            headers: {
				'Content-Type': 'application/json',
                'username': username,
                
			},
            body: JSON.stringify({
                workoutId: eWork,
                moveName: eName,
                set: set,
                rep: rep,
                set_id: eId,
                setNum: -1
            }),
        })
        const data = await response.json()

        if(data.status === 'error') {
            console.log('reached')
        }
        else {
            console.log('tes')
            let newExercise = {workout_id: eWork, move_name: eName, repetition: set, rep_count: rep, set_id: eId};
            if(exercises === undefined) {
                setExercises([newExercise])
            }
            else {
                setExercises(prevState => [...prevState, newExercise]);
            }
            setShowE(false);
            alert('Exercise added')
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
            Add Custom Workout
            </Button>
  
        </Form>

        {workouts.map(d => (
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                <Card.Title>{d.name}</Card.Title>
                <Card.Text className="me-3">
                {d.day} 
                 </Card.Text>
                <Button onClick={() => showAddExercise(d.workout_id)}>
                    Add Exercise 
                </Button>
                <Modal show={showE} onHide={handleCloseE}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add Exercise</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form onSubmit={addExercise}>
                            <Form.Group className="mb-3">
                                <Form.Label>Exercise Name</Form.Label>
                                <Form.Control className="position-relative" type="text" placeholder="Enter Name" onChange={(e) => setEName(e.target.value)} required/>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Set Count</Form.Label>
                                <Form.Control className="position-relative" type="number" placeholder="Enter Number of Sets" onChange={(e) => setSet(e.target.value)} required/>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Repetition</Form.Label>
                                <Form.Control className="position-relative" type="number" placeholder="Enter Number of Reps" onChange={(e) => setRep(e.target.value)} required/>
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Add Exercise
                            </Button>
  
                        </Form>
                        
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseE}>
                        Close
                    </Button>
                    
                    </Modal.Footer>
                </Modal>



                <Button onClick={() => showWorkouts(d.workout_id)}>
                    View Workout
                </Button>

                <Button onClick={() => shareWorkouts(d.workout_id, d.name)}>
                    Share Workout
                </Button>

                <Modal show={showWork} onHide={handleCloseW}>
                    <Modal.Header closeButton>
                    <Modal.Title>{d.name}</Modal.Title>
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
                


                </Card.Body>
            </Card>
        ))}


    </div>
    
  )
}
