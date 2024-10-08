import React from 'react';
import { ListGroup, Row, Col } from 'react-bootstrap';
import SingleTaskComponent from './SingleTaskComponent';

const TaskListComponent = ({ tasks, fetchTasks, virtualTime }) => {
  return (
    <div className="text-center">
      <h2 className="mb-4">Attività</h2>
      <ListGroup className="w-75 mx-auto">
        <ListGroup.Item className="text-center bg-primary text-white">
          <Row>
            <Col>Titolo</Col>
            <Col>Data di Scadenza</Col>
            <Col>Stato</Col>
            <Col></Col>
            <Col></Col>
          </Row>
        </ListGroup.Item>
        {tasks.map((task) => (
          <SingleTaskComponent key={task._id} task={task} fetchTasks={fetchTasks} />
        ))}
      </ListGroup>
    </div>
  );
};

export default TaskListComponent;
