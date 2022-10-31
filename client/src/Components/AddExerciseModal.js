import {Modal, Form, Button} from "react-bootstrap"
import {useRef} from "react"
import WorkoutsContext from "../contexts/WorkoutsContext"
import {useWorkouts} from "../contexts/WorkoutsContext"

export default function AddExpenseModal ({show, handleClose, defaultWorkoutId}) {
    const descriptionRef = useRef()
    const setsRef = useRef()
    const repsRef = useRef()
    const weightRef = useRef()
    const workoutIdRef = useRef()
    const { addExercise, workouts } = useWorkouts()
    function handleSubmit(e) {
        e.preventDefault()
        addExercise({
            description: descriptionRef.current.value,
            sets: setsRef.current.value,
            reps: repsRef.current.value,
            weight: weightRef.current.value,
            workoutId: workoutIdRef.current.value

        })
        handleClose()
        

    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>>
                    <Modal.Title>New Exercise</Modal.Title>
                
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label >Description</Form.Label>
                        <Form.Control ref={descriptionRef} type="text" required />

                    </Form.Group>

                    <Form.Group className="mb-3" controlId="reps">
                        <Form.Label>Reps</Form.Label>
                        <Form.Control ref={repsRef} type="number" min={0} step={1} required />

                    </Form.Group>

                    <Form.Group  className="mb-3" controlId="sets">
                        <Form.Label>Sets</Form.Label>
                        <Form.Control ref={setsRef} type="number" step={1} required />

                    </Form.Group>

                    <Form.Group className="mb-3" controlId="weight">
                        <Form.Label>Weight</Form.Label>
                        <Form.Control ref={weightRef} type="number" step={5} required />

                    </Form.Group>

                    <Form.Group  className="mb-3" controlId="workoutId">
                        <Form.Label>Workout</Form.Label>
                        <Form.Select
                            defaultValue={defaultWorkoutId}
                            ref = {workoutIdRef}>
                                {workouts.map(workout => (
                                    <option key={workout.id} value = {workout.id}>
                                        {workout.name}
                                    </option>
                                ))}
                        </Form.Select>
                            

                    </Form.Group>
                    <div className="d-flex justify-content-end">
                            <Button variant ="primary" type="submit">Add </Button>
                    </div>
                </Modal.Body>

            </Form>

        </Modal>
    )
}