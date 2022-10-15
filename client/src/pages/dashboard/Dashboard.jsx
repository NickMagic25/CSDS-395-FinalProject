import Navbar from "../../components/navbar/Navbar";
import Feed from "../../components/feed/Feed";
import Pbbar from "../../components/pbbar/Pbbar";
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
