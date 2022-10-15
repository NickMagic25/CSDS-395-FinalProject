import "./navbar.css"
export default function Navbar() {
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
                <span className="navbarLink">My Workouts</span>
                <span className="navbarLink">Friends</span>
            </div>
            <div className="navbarIcons">
                <img src="/assets/person.jpg" className="navbarImg"/>
            </div>
              
        </div>
    )

}