import WorkOutList from "../Components/workouts/WorkOutList";

const DUMMY_DATA = [
    {
      id: 'Workout 1',
      title: 'Bicep Sesh',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Close_grip_ez_bar_curl_with_barbell_2.svg/1280px-Close_grip_ez_bar_curl_with_barbell_2.svg.png',
      address: 'Meetupstreet 5, 12345 Meetup City',
      description:
        'You cant be sad when you jacked',
    },
    {
      id: 'Workout 2',
      title: 'Deadlifts',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Romanian-deadlift-1.png/413px-Romanian-deadlift-1.png',
      address: 'Meetupstreet 5, 12345 Meetup City',
      description:
        'Deadlifts are a vibe',
    },
  ];

function HomePage(){
    return <section>
        <h1>Quick Workouts</h1>
        <WorkOutList workouts = {DUMMY_DATA}></WorkOutList>
    </section>;
}

export default HomePage; 