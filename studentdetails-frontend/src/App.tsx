import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentDetails from './components/Student_Details';
import Student_Dashboard from './components/Student_Dashboard';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/studentdetails" element={<StudentDetails />} />
          <Route path='/dashboard' element={<Student_Dashboard/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
