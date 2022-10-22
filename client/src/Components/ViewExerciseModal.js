import {Modal, Form, Button, Stack} from "react-bootstrap"
import {useRef} from "react"
import WorkoutsContext from "../contexts/WorkoutsContext"
import {useWorkouts} from "../contexts/WorkoutsContext"

export default function ViewExerciseModal ({workoutId, handleClose}) {
    const { getWorkoutExercises, workouts, deleteWorkout, deleteExercise} = useWorkouts()
    const exercises = getWorkoutExercises(workoutId)

    const workout = workouts.find(w => w.id === workoutId)
    return (
        <Modal show={workoutId != null} onHide={handleClose}>
                <Modal.Header closeButton>>
                    <Modal.Title>
                        <Stack direction="horizontal" gap="2">
                            <div>Excercises - {workout?.name}</div>
                            <Button onClick={()=> {
                                deleteWorkout(workout)
                                handleClose()
                            }} variant="outline-danger">Delete</Button>
                        </Stack>

                    </Modal.Title>
                
                </Modal.Header>
                <Modal.Body>
                    <Stack direction ="vertical" gap="3">
                            {exercises.map(exercise => (
                                <Stack direction ="horizontal" gap="2" key={exercise.id}>
                                    <div className="me-auto fs-4">{exercise.description}</div>
                                    <div className="fs-5">{exercise.sets} x {exercise.reps} @ {exercise.weight}lb</div>
                                    <Button onClick={() => deleteExercise(exercise)} size="sm" variant="outline-danger">&times;</Button>
                                </Stack>
                            ))}
                    </Stack>

                    
                </Modal.Body>


        </Modal>
    )
}