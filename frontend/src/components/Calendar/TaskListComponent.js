import React from 'react';
import { ListGroup } from 'react-bootstrap';
import SingleTaskComponent from './SingleTaskComponent';

const TaskListComponent = ({ tasks }) => {
  return (
    <ListGroup>
      {tasks.map((task) => (
        <SingleTaskComponent key={task._id} task={task} />
      ))}
    </ListGroup>
  );
};

export default TaskListComponent;
