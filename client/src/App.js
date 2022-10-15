import {BrowserRouter, Router, Routes, Route} from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  
  return (
  <BrowserRouter>
    <Routes>
      <Route>
        <Route path='/' element={<Dashboard />} />
      </Route>
    </Routes>
  </BrowserRouter>

    );
    
  
}

export default App;
