import './App.css';
// copied from react router dom
import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Link
} from "react-router-dom";

//imports 
import Navbar from './components/Navbar';
import { Home } from './components/Home';
import About from './components/About';
import NoteState from './context/notes/NoteState';
import { Alert } from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';
function App() {
  return (
    <>
      <NoteState>
        <Router>
          <Navbar />
          <Alert message = "Warning"/>
          <div className='container'>
            <Routes>
              <Route path="/" element={<Home />}>
              </Route>
              <Route path="/about" element={<About />}>
              </Route>
              <Route path="/login" element={<Login />}>
              </Route>
              <Route path="/signup" element={<Signup />}>
              </Route>
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
