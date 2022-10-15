import classes from "./WorkoutList.module.css";
import Workout from "./Workout";

function WorkOutList(props) {
  return (
    <ul className={classes.list}>
      {props.workouts.map((workout) => (
        <Workout
          key={workout.id}
          id={workout.id}
          image={workout.image}
          title={workout.title}
          description = {workout.description}
        />
      ))}
    </ul>
  );
}
export default WorkOutList;