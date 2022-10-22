import { Button, Stack} from "react-bootstrap"
import Container from "react-bootstrap/Container"
import WorkoutCard from "../../Components/workoutcard/WorkoutCard"
import AddWorkoutModal from "../../Components/AddWorkoutModal"
import AddExerciseModal from "../../Components/AddExerciseModal"
import ViewExerciseModal from "../../Components/ViewExerciseModal"
import { useState } from "react"
import {useWorkouts} from "../../contexts/WorkoutsContext"

function Workout() {
    const [showAddWorkoutModal, setShowAddWorkoutModal] = useState(false)
    const [showAddExerciseModal, setShowAddExcerciseModal] = useState(false)
    const [viewExerciseModalWorkoutId, setViewExerciseModalWorkoutId] = useState()

    const [addExerciseModalWorkoutId, setAddExerciseModalWorkoutId] = useState()
    const{ workouts } = useWorkouts()

    function openAddExcerciseModal(workoutId) {
        setShowAddExcerciseModal(true)
        setAddExerciseModalWorkoutId(workoutId)
    }

    return (

    <>
        <Container className="my-4">
            <Stack direction="horizontal" gap="2" className="mb-4">
                <h1 className="me-auto"> Workouts</h1>
                <Button variant="primary" onClick={() => setShowAddWorkoutModal(true)}>Add Workout</Button>
                <Button variant="outline-primary" onClick={openAddExcerciseModal}>Add Exercise</Button>

            </Stack>
            <div 
            style={{ 
                display:"grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", 
                gap:"1rem", 
                alignItems: "flex-start",
                }}
            >
                {workouts.map(workout => (
                    <WorkoutCard 
                    key={workout.id}
                    name={workout.name}
                    day={workout.day} 
                    onAddExcerciseClick={() => openAddExcerciseModal(workout.id)}
                    onViewExerciseClick={() => setViewExerciseModalWorkoutId(workout.id)}
                    
                    />
                ))}

            
            </div>
        </Container>
        <AddWorkoutModal show={showAddWorkoutModal} handleClose={()=>
        setShowAddWorkoutModal(false)} />
        <AddExerciseModal 
        show={showAddExerciseModal} 
        defaultWorkoutId={addExerciseModalWorkoutId}
        handleClose={()=>
        setShowAddExcerciseModal(false)} />

        <ViewExerciseModal 
        workoutId={viewExerciseModalWorkoutId}
        defaultWorkoutId={addExerciseModalWorkoutId}
        handleClose={()=>
        setViewExerciseModalWorkoutId()} />
    </>


    )

}

export default Workout