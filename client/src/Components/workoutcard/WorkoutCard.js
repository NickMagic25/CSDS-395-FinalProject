import { Card, Stack, Button } from "react-bootstrap";

export default function WorkoutCard({ name, day, onAddExcerciseClick, onViewExerciseClick}) {
    const classNames=[]
    return (
        <Card className={classNames.join(" ")}>
            <Card.Body>
                <Card.Title className="d-flex justify-content-between
                align-items-baseline fw-normal">
                    <div className="me-2">{name}</div>
                    <div className="d-flex align-items-baseline me-2">{day}</div>

                </Card.Title>

                <Stack direction="horizontal" gap="2" className="mt-4">
                    <Button variant="outline-primary" className="ms-auto" onClick={onAddExcerciseClick}>Add Exercise</Button>
                    <Button variant="outline-secondary" onClick={onViewExerciseClick}>View Workout</Button>
                </Stack>
            </Card.Body>
        </Card>

    )

}