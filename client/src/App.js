import logo from './logo.svg';
import './App.css';
import Navbar from './Navbar';

function App() {
  const handleSubmit = (e) => {
    e.preventDefault();
  }
  return (
    <div className="container">
      <Navbar />
      <form onSubmit={handleSubmit}>
        <h1>Login Form</h1>
          <label for="username">UserName</label>
          <input type="text" name="username" id="name" />
          <button>Submit</button>
      </form>
    </div>
  )
}

export default App;
