import "./write.css";

export default function Write() {
  return (
    <div className="write">
        <div className="writeWrapper">
            <div className="writeTop">
                
                <img src="/assets/person.jpg" alt="" className="shareProfileImg" /> 
                <input type="text" className="writeInput" placeholder="Say What's Up"/>
            </div>
            <hr className="shareHr" />
            <div className="writeBottom">
                <div className="shareOptions">
                    <div className="shareOption">
                        <span className="shareOptionText">Photo or Video</span>
                    </div>

                    <div className="shareOption">
                        <span className="shareOptionText">Workouts</span>
                    </div>

                    <div className="shareOption">
                        <span className="shareOptionText">Location</span>
                    </div>
                    
                </div>
                <button className="shareButton"> Share </button>
            </div>
        </div>
    </div>
  )
}
