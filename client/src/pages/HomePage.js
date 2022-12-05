import Navbar from "../Components/navbar/Navbar";
import {Container, Col, Row} from 'react-bootstrap'
import styles from './HomePage.module.css'
import Deadlift from '../deadlift.png'
import Social from '../social.jpeg'


function HomePage(){
    return <section>
      <Navbar/>
      <Container>
        <Row>
          <Col>
          <h1 className={styles.h1Format}>WHERE SHARING YOUR FITNESS JOURNEY BECOMES EASIER</h1>
          <h2 className = {styles.h2Format}>THE GO-TO ONLINE PLATFORM FOR TRACKING AND SHARING YOUR WORKOUT JOURNEY WITH FRIENDS!</h2>
          <form>
            <label>
               <input type="text" name="name" defaultValue={"Enter Email"} className={styles.emailBox}/>
               </label>
                <input type="submit" value="Sign up" className={styles.submitButton}/>
                </form>

                <img src = {Social} alt = "Social media graph" className={styles.img}></img>
                
                
          </Col>
          <Col>
          <img src = {Deadlift} alt ="Deadlift" className={styles.deadLiftImage}></img>
          </Col>
        </Row>
      </Container>
  
       
    </section>;
}

export default HomePage; 