import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentDetails from './components/Student_Details';
import Student_Dashboard from './components/Student_Dashboard';
import StudentDetails_Antd from './components/StudentDetails_Antd';
import StudentDashboard_Antd from './components/StudentDashboard_Antd';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/studentdetails" element={<StudentDetails />} />
          <Route path='/dashboard' element={<Student_Dashboard/>}/>
          <Route path='/Studentdetails-antd' element={<StudentDetails_Antd/>}/>
          <Route path='/Studentdashboard-antd' element={<StudentDashboard_Antd/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
