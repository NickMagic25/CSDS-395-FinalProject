import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorPage from "./pages/Error";
import Layout from "./components/layout/layout/Layout";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignUp from "./pages/SignUp";
import Chat from "./pages/Chat";

function App() {
  return (
    <Layout>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>}/>;
          <Route path="/about" element={<About />}/>;
          <Route path="/contact" element={<Contact/>} />;
          <Route path="/login" element={<Login />} />;
          <Route path="/sign-up" element={<SignUp />} />;
          <Route path="/chat" element={<Chat />} />;
          <Route path="*" element={<ErrorPage />} /> ;
        </Routes>
      </Router>
    </Layout>
  );
}

export default App;
