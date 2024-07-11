import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Selfie App</h1>
      <Link to="/pomodoro">
        <Button variant="primary" type="submit" className="mt-3">
          Pomodoro App
        </Button>
      </Link>
    </div>
  );
};

export default Home;