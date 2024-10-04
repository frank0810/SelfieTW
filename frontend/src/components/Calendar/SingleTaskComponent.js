import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';

const SingleTaskComponent = ({ task }) => {
  const handleCompleteTask = async () => {
    // Logica per completare l'attività
  };

  return (
    <ListGroup.Item>
      <div>
        <span>{task.title}</span>
        <span>{new Date(task.deadlineDate).toLocaleDateString()}</span>
        <Button onClick={handleCompleteTask} variant="success">Completa</Button>
      </div>
    </ListGroup.Item>
  );
};

export default SingleTaskComponent;
