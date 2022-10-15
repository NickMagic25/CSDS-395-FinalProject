import Navbar from "../../Components/navbar/Navbar";
import Feed from "../../Components/feed/Feed";
import Pbbar from "../../Components/pbbar/Pbbar";
import "./dashboard.css";

export default function Dashboard() {
  return (
    <>
        <Navbar />
        <div className="dashboardContainer">
          <Feed />
          <Pbbar />
        </div>
    </>
  );
};
