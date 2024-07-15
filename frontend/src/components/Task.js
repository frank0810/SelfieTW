import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Navbar, Nav, Button, Modal, Form, ListGroup } from 'react-bootstrap';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', deadline: '' });

  useEffect(() => {
    const fetchTasks = async () => {
      const result = await axios.get('http://localhost:3000/tasks');
      setTasks(result.data);
    };
    fetchTasks();
  }, []);

  const handleSave = async () => {
    await axios.post('http://localhost:3000/tasks', newTask);
    setTasks([...tasks, newTask]);
    setShowModal(false);
  };

  return (
    <Container fluid className="p-0">
      <Navbar bg="light" expand="lg" className="w-100">
        <Navbar.Brand style={{ marginLeft: '20px' }}>SelfieApp</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/pomodoro">Pomodoro</Nav.Link>
          <Nav.Link href="/calendar">Calendario</Nav.Link>
          <Nav.Link href="/notes">Note</Nav.Link>
        </Nav>
        <Nav className="ms-auto">
          <Nav.Link href="/profile">Profilo</Nav.Link>
          <Nav.Link href="/logout">Logout</Nav.Link>
        </Nav>
      </Navbar>
      <h1>Tasks</h1>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Add Task
      </Button>
      <ListGroup className="mt-3">
        {tasks.map((task, index) => (
          <ListGroup.Item key={index}>
            {task.title} - {new Date(task.deadline).toLocaleString()}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTaskTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formTaskDeadline" className="mt-3">
              <Form.Label>Deadline</Form.Label>
              <Form.Control
                type="datetime-local"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Tasks;
