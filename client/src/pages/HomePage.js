import Navbar from "/Users/varundutta/Desktop/Senior Project/CSDS-395-FinalProject/client/src/Components/navbar/Navbar.jsx";
import {Container, Col, Row} from 'react-bootstrap'
import format from './HomePage.css'
import Deadlift from '../deadlift.png'
import Social from '../social.jpeg'


function HomePage(){
    return <section className="homePage">
      <Navbar/>
      <Container>
        <Row>
          <Col>
          <h1 className="mainText">WHERE SHARING YOUR FITNESS JOURNEY BECOMES EASIER</h1>
          <h2>THE GO-TO ONLINE PLATFORM FOR TRACKING AND SHARING YOUR WORKOUT JOURNEY WITH FRIENDS!</h2>
          <form>
            <label>
               <input type="text" name="name" defaultValue={"Enter Email"}/>
               </label>
                <input type="submit" value="Sign up" />
                </form>

                <img src = {Social} alt = "Social media graph" className="img"></img>
                
                
          </Col>
          <Col>
          <img src = {Deadlift} alt ="Deadlift"></img>
          </Col>
        </Row>
      </Container>
  
       
    </section>;
}

export default HomePage; 