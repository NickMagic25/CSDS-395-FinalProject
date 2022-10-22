import {Modal, Form, Button} from "react-bootstrap"
import {useRef} from "react"
import WorkoutsContext from "../contexts/WorkoutsContext"
import {useWorkouts} from "../contexts/WorkoutsContext"

export default function AddWorkoutModal ({show, handleClose}) {
    const nameRef = useRef()
    const dayRef = useRef()
    const { addWorkout } = useWorkouts()
    function handleSubmit(e) {
        e.preventDefault()
        addWorkout({
            name: nameRef.current.value,
            day: dayRef.current.value
        })
        handleClose()
        

    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>>
                    <Modal.Title>New Workout</Modal.Title>
                
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label className="mb-3" controlId="name">Name</Form.Label>
                        <Form.Control ref={nameRef} type="text" required />

                    </Form.Group>

                    <Form.Group>
                        <Form.Label className="mb-3" controlId="day">Schedule Day</Form.Label>
                        <Form.Select ref={dayRef} required>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednsday">Wednsday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
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