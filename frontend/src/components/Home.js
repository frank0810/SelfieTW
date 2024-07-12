import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import NavigationBar from './Navbar';

const Home = () => {
  return (
    <>
      <NavigationBar isAuthenticated={true} />
      <div className='container'>
        <Link to="/pomodoro">
          <Button variant="primary" type="submit" className="mt-3">
            Pomodoro App
          </Button>
        </Link>
      </div>
    </>
  );
};

export default Home; 