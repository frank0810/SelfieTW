import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import Home from './components/Home/Home';
import PrivateRoute from './components/PrivateRoute';
import PomodoroView from './components/PomodoroView/PomodoroView';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/pomodoro" element={<PomodoroView />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
