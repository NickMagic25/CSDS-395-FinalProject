import "./navbar.css"
import { Link, useHistory } from "react-router-dom";

export default function Navbar() {
    const history = useHistory();


    function logoff() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        history.push('/login');
    }

    function viewProfile() {
        history.push('/userProfile');
    }


    return (
        <div className="navbarContainer">
            <div className="navbarLeft">
                <span className="logo">InstaJacked</span>
            </div>
            <div className="navbarCenter">
                <div className="searchbar">
                    <input placeholder="Search for friends, workouts, and posts" className="searchInput"/>
                </div>
            </div>
            <div className="navbarRight">
                <Link to="/workout" className="navbarLink">My Workouts</Link>
                <span className="navbarLink">Friends</span>
            </div>
            <div className="navbarIcons">
                <form onSubmit={viewProfile}>
                    <button><img style={{"height":"30px", "width": "30px"}} src ="/assets/person.jpg"/></button>
                </form>
            </div>
            <button onClick={logoff}>
                Log Off
            </button>
              
        </div>
    )

}