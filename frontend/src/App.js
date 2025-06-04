import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import Home from './components/Home/Home';
import PrivateRoute from './components/PrivateRoute';
import ProfilePage from './components/ProfilePage';
import PomodoroView from './components/PomodoroView/PomodoroView';
import Note from './components/Note';
import CalendarComponent from './components/Calendar/CalendarComponent';
import TimeMachine from './components/TimeMachine';
import { TimeMachineProvider } from './TimeMachineContext';
import TimeMachineTest from './components/TimeMachineTest'

const App = () => {
  return (
    <TimeMachineProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/" element={<><TimeMachine /> <Home /></>} />
              <Route path="/pomodoro" element={ <><TimeMachine /><PomodoroView /></>} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notes" element={<><TimeMachine /><Note /></>} />
              <Route path="/calendar" element={<><TimeMachine /> <CalendarComponent /></>} />
              <Route path="/testing" element={<><TimeMachine /> <TimeMachineTest /></>} />
            </Route>
          </Routes>
        </div>
      </Router>
    </TimeMachineProvider>
  );
};

export default App;