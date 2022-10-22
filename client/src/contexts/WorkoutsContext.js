import React, {useContext, useState} from 'react'
import {v4 as uuidV4} from 'uuid'
import useLocalStorage from '../hooks/useLocalStorage'

const WorkoutsContext = React.createContext()

export function useWorkouts() {
    return useContext(WorkoutsContext)
}

// {
//     id:
//     name:
//     day:
// }

// {
//     id:
//     workoutId:
//     sets:
//     reps:
//     description:
// }

export const WorkoutsProvider = ({ children }) => {
    const [workouts, setWorkouts] = useLocalStorage("workouts", [])
    const [exercises, setExercises] = useLocalStorage("exercises", []);

    function getWorkoutExercises(workoutId) {
        return exercises.filter(exercise => exercise.workoutId === workoutId);

    }
    function addExercise({description, sets, reps, weight, workoutId}) {
        setExercises(prevExercises => {
            return [...prevExercises, {id: uuidV4(), description, sets, reps, weight, workoutId}]
        })

    }
    function addWorkout({name , day}) {
        setWorkouts(prevWorkouts => {
            if (prevWorkouts.find(workout => workout.name === name)) {
                return prevWorkouts;
            }
            return [...prevWorkouts, {id: uuidV4(), name, day}]
        })

    }
    function deleteWorkout({id}) {
        setWorkouts(prevWorkouts => {
            return prevWorkouts.filter(workout => workout.id !== id)
        })

    }
    function deleteExercise({id}) {
        setExercises(prevExercises => {
            return prevExercises.filter(exercise => exercise.id !== id)
        })

    }


    return (
        <WorkoutsContext.Provider value ={{
            workouts,
            exercises,
            getWorkoutExercises,
            addExercise,
            addWorkout,
            deleteWorkout,
            deleteExercise

        }}>{children}</WorkoutsContext.Provider>
    )
}