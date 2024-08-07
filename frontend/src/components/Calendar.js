import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Navbar, Nav, Button, Modal, Form } from 'react-bootstrap';
import Calendar from 'react-calendar'; 
import 'react-calendar/dist/Calendar.css'; 
import { Link } from 'react-router-dom';

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [newEvent, setNewEvent] = useState({
    title: '',
    startDate: new Date(),
    endDate: new Date(),
    location: '',
    recurrence: '',
    notifications: [],
  });

  const [newTask, setNewTask] = useState({
    title: '',
    deadline: new Date(),
    notifications: [],
  });

  useEffect(() => {
    fetchEvents();
    fetchTasks();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Errore nel caricamento degli eventi:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Errore nel caricamento delle attività:', error);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/events', newEvent);
      fetchEvents();
      setShowEventModal(false);
    } catch (error) {
      console.error("Errore nella creazione dell'evento:", error);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/tasks', newTask);
      fetchTasks();
      setShowTaskModal(false);
    } catch (error) {
      console.error("Errore nella creazione dell'attività:", error);
    }
  };

  return (
    <Container>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>Calendario</Navbar.Brand>
        <Nav className="mr-auto">
          <Link to="/calendar" className="nav-link">Calendario</Link> {/* Link per il calendario */}
          <Button onClick={() => setShowEventModal(true)}>Aggiungi Evento</Button>
          <Button onClick={() => setShowTaskModal(true)}>Aggiungi Attività</Button>
        </Nav>
      </Navbar>

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={({ date, view }) => (
          <div>
            {events.map(
              (event) =>
                event.startDate <= date &&
                event.endDate >= date && (
                  <div key={event._id}>{event.title}</div>
                )
            )}
            {tasks.map(
              (task) =>
                task.deadline.toDateString() === date.toDateString() && (
                  <div key={task._id}>{task.title}</div>
                )
            )}
          </div>
        )}
      />

      {/* Modal per aggiungere un evento */}
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Aggiungi Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEventSubmit}>
            <Form.Group controlId="formEventTitle">
              <Form.Label>Titolo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci il titolo"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEventStartDate">
              <Form.Label>Data Inizio</Form.Label>
              <Form.Control
                type="datetime-local"
                value={newEvent.startDate}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, startDate: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEventEndDate">
              <Form.Label>Data Fine</Form.Label>
              <Form.Control
                type="datetime-local"
                value={newEvent.endDate}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, endDate: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEventLocation">
              <Form.Label>Luogo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci il luogo"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEventRecurrence">
              <Form.Label>Ricorrenza</Form.Label>
              <Form.Control
                as="select"
                value={newEvent.recurrence}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, recurrence: e.target.value })
                }
              >
                <option value="">Nessuna</option>
                <option value="daily">Giornaliera</option>
                <option value="weekly">Settimanale</option>
                <option value="monthly">Mensile</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formEventNotifications">
              <Form.Label>Notifiche</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci le notifiche"
                value={newEvent.notifications}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    notifications: e.target.value.split(','),
                  })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Aggiungi Evento
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal per aggiungere un'attività */}
      <Modal show={showTaskModal} onHide={() => setShowTaskModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Aggiungi Attività</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleTaskSubmit}>
            <Form.Group controlId="formTaskTitle">
              <Form.Label>Titolo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci il titolo"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formTaskDeadline">
              <Form.Label>Scadenza</Form.Label>
              <Form.Control
                type="datetime-local"
                value={newTask.deadline}
                onChange={(e) =>
                  setNewTask({ ...newTask, deadline: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formTaskNotifications">
              <Form.Label>Notifiche</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci le notifiche"
                value={newTask.notifications}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    notifications: e.target.value.split(','),
                  })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Aggiungi Attività
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CalendarComponent;
