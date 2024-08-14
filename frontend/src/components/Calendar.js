import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Modal, Form, Row, Col, Card } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import NavigationBar from './Navbar'; 
import './CalendarStyles.css';

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formType, setFormType] = useState(''); // '' inizialmente, poi 'event' o 'task'
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    endDate: '',
    endTime: '',
    location: '',
    recurrence: '',
    repeatCount: '',
    repeatUntil: '',
    notifications: [],
    notificationTime: '',
    notificationRepeat: '',
  });

  const [newTask, setNewTask] = useState({
    title: '',
    deadlineDate: '',
    deadlineTime: '',
    notifications: [],
    completed: false,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formType === 'event') {
        await axios.post('/events', {
          title: newEvent.title,
          startDate: `${newEvent.date}T${newEvent.time}`,
          endDate: `${newEvent.endDate}T${newEvent.endTime}`,
          location: newEvent.location,
          recurrence: newEvent.recurrence,
          repeatCount: newEvent.repeatCount,
          repeatUntil: newEvent.repeatUntil,
          notifications: newEvent.notifications,
          notificationTime: newEvent.notificationTime,
          notificationRepeat: newEvent.notificationRepeat,
        });
        fetchEvents();
      } else if (formType === 'task') {
        await axios.post('/tasks', {
          title: newTask.title,
          deadline: `${newTask.deadlineDate}T${newTask.deadlineTime}`,
          notifications: newTask.notifications,
          completed: newTask.completed,
        });
        fetchTasks();
      }
      setShowFormModal(false);
      resetForm();
    } catch (error) {
      console.error(`Errore nella creazione di ${formType === 'event' ? 'evento' : 'attività'}:`, error);
    }
  };

  const resetForm = () => {
    setNewEvent({
      title: '',
      date: '',
      time: '',
      endDate: '',
      endTime: '',
      location: '',
      recurrence: '',
      repeatCount: '',
      repeatUntil: '',
      notifications: [],
      notificationTime: '',
      notificationRepeat: '',
    });
    setNewTask({
      title: '',
      deadlineDate: selectedDate.toISOString().split('T')[0], // Preimposta la data selezionata
      deadlineTime: '',
      notifications: [],
      completed: false,
    });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormType('');
    setShowModal(true);
  };

  const handleEntryDelete = async (id, type) => {
    try {
      await axios.delete(`/${type}s/${id}`);
      type === 'event' ? fetchEvents() : fetchTasks();
    } catch (error) {
      console.error(`Errore nell'eliminazione di ${type}:`, error);
    }
  };

  const handleTaskCompletion = async (id, completed) => {
    try {
      await axios.patch(`/tasks/${id}`, { completed });
      fetchTasks();
    } catch (error) {
      console.error('Errore nell\'aggiornamento dell\'attività:', error);
    }
  };

  const openFormModal = (type) => {
    setFormType(type);
    if (type === 'event') {
      setNewEvent({
        ...newEvent,
        date: selectedDate.toISOString().split('T')[0], // Preimposta la data selezionata
      });
    } else if (type === 'task') {
      setNewTask({
        ...newTask,
        deadlineDate: selectedDate.toISOString().split('T')[0], 
      });
    }
    setShowModal(false);
    setShowFormModal(true);
  };

  const handleTaskOverdue = () => {
    const now = new Date();
    tasks.forEach(task => {
      const deadline = new Date(task.deadline);
      if (!task.completed && deadline < now) {
        axios.post('/notifications', {
          title: 'Attività in ritardo!',
          message: `L'attività "${task.title}" è in ritardo!`,
          type: 'daily',
          until: new Date(deadline.setDate(deadline.getDate() + 1)), // notifica giornaliera
        });
      }
    });
  };

  useEffect(() => {
    handleTaskOverdue();
  }, [tasks]);

  return (
    <Container fluid>
      <NavigationBar isAuthenticated={true} />

      <Row className="justify-content-center mt-4">
        <Col xs={12} md={8} lg={3}> 
          <div className="calendar-container">
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileContent={({ date, view }) => (
                <div>
                  {view === 'month' && events.map(event => (
                    new Date(event.startDate) <= date && new Date(event.endDate) >= date && (
                      <div key={event._id} className="event-marker">{event.title}</div>
                    )
                  ))}
                  {view === 'month' && tasks.map(task => (
                    new Date(task.deadline).toDateString() === date.toDateString() && (
                      <div key={task._id} className="task-marker">{task.title} (Scadenza)</div>
                    )
                  ))}
                </div>
              )}
            />
          </div>
        </Col>
      </Row>

      {/* Modal per selezionare tipo di form (evento o attività) */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Creare un Evento o Attività?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant="primary" onClick={() => openFormModal('event')}>Evento</Button>
          <Button variant="secondary" onClick={() => openFormModal('task')}>Attività</Button>
        </Modal.Body>
      </Modal>

      {/* Modal per aggiungere un evento */}
      <Modal show={showFormModal && formType === 'event'} onHide={() => setShowFormModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Aggiungi Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Titolo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci il titolo"
                value={newEvent.title}
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDate">
              <Form.Label>Data Inizio</Form.Label>
              <Form.Control
                type="date"
                value={newEvent.date}
                onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formTime">
              <Form.Label>Ora Inizio</Form.Label>
              <Form.Control
                type="time"
                value={newEvent.time}
                onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEndDate">
              <Form.Label>Data Fine</Form.Label>
              <Form.Control
                type="date"
                value={newEvent.endDate}
                onChange={e => setNewEvent({ ...newEvent, endDate: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEndTime">
              <Form.Label>Ora Fine</Form.Label>
              <Form.Control
                type="time"
                value={newEvent.endTime}
                onChange={e => setNewEvent({ ...newEvent, endTime: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formRecurrence">
              <Form.Label>Frequenza</Form.Label>
              <Form.Control
                as="select"
                value={newEvent.recurrence}
                onChange={e => setNewEvent({ ...newEvent, recurrence: e.target.value })}
              >
                <option value="">Nessuna</option>
                <option value="daily">Giornaliera</option>
                <option value="weekly">Settimanale</option>
                <option value="monthly">Mensile</option>
                <option value="custom">Personalizzata</option>
              </Form.Control>
            </Form.Group>
            {newEvent.recurrence === 'custom' && (
              <Form.Group controlId="formCustomRecurrence">
                <Form.Label>Recorrenza Personalizzata</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Descrivi la ricorrenza es. 'ogni martedì e giovedì'"
                  value={newEvent.customRecurrence}
                  onChange={e => setNewEvent({ ...newEvent, customRecurrence: e.target.value })}
                />
              </Form.Group>
            )}
            <Form.Group controlId="formRepeatCount">
              <Form.Label>Ripeti</Form.Label>
              <Form.Control
                as="select"
                value={newEvent.repeatCount}
                onChange={e => setNewEvent({ ...newEvent, repeatCount: e.target.value })}
              >
                <option value="">Indefinitamente</option>
                <option value="n_times">N volte</option>
                <option value="until_date">Fino alla data</option>
              </Form.Control>
              {newEvent.repeatCount === 'n_times' && (
                <Form.Control
                  type="number"
                  placeholder="Numero di ripetizioni"
                  onChange={e => setNewEvent({ ...newEvent, repeatCountValue: e.target.value })}
                />
              )}
              {newEvent.repeatCount === 'until_date' && (
                <Form.Control
                  type="date"
                  onChange={e => setNewEvent({ ...newEvent, repeatUntil: e.target.value })}
                />
              )}
            </Form.Group>
            <Form.Group controlId="formNotificationMethod">
              <Form.Label>Notifica</Form.Label>
              <Form.Control
                as="select"
                value={newEvent.notifications.method}
                onChange={e => setNewEvent({ ...newEvent, notifications: { ...newEvent.notifications, method: e.target.value } })}
              >
                <option value="alert">Alert</option>
                <option value="system">Sistema</option>
                <option value="email">Email</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formNotificationTime">
              <Form.Label>Quando ricevere la notifica</Form.Label>
              <Form.Control
                as="select"
                value={newEvent.notificationTime}
                onChange={e => setNewEvent({ ...newEvent, notificationTime: e.target.value })}
              >
                <option value="">All'ora dell'evento</option>
                <option value="1_minute">1 minuto prima</option>
                <option value="5_minutes">5 minuti prima</option>
                <option value="1_hour">1 ora prima</option>
                <option value="2_hours">2 ore prima</option>
                <option value="1_day">1 giorno prima</option>
                <option value="2_days">2 giorni prima</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formNotificationRepeat">
              <Form.Label>Ripetizione della Notifica</Form.Label>
              <Form.Control
                as="select"
                value={newEvent.notificationRepeat}
                onChange={e => setNewEvent({ ...newEvent, notificationRepeat: e.target.value })}
              >
                <option value="">Non ripetere</option>
                <option value="every_minute">Ogni minuto</option>
                <option value="every_hour">Ogni ora</option>
                <option value="until_response">Fino a risposta</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              Salva Evento
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal per aggiungere un'attività */}
      <Modal show={showFormModal && formType === 'task'} onHide={() => setShowFormModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Aggiungi Attività</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Titolo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci il titolo"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDeadlineDate">
              <Form.Label>Data Scadenza</Form.Label>
              <Form.Control
                type="date"
                value={newTask.deadlineDate}
                onChange={e => setNewTask({ ...newTask, deadlineDate: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formDeadlineTime">
              <Form.Label>Ora Scadenza</Form.Label>
              <Form.Control
                type="time"
                value={newTask.deadlineTime}
                onChange={e => setNewTask({ ...newTask, deadlineTime: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Salva Attività
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Eventi</Card.Title>
              <ul>
                {events.map(event => (
                  <li key={event._id}>
                    {event.title} - {new Date(event.startDate).toLocaleDateString()} {new Date(event.startDate).toLocaleTimeString()} 
                    <Button variant="danger" onClick={() => handleEntryDelete(event._id, 'event')}>Elimina</Button>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Attività</Card.Title>
              <ul>
                {tasks.map(task => (
                  <li key={task._id}>
                    {task.title} - {new Date(task.deadline).toLocaleDateString()} {new Date(task.deadline).toLocaleTimeString()}
                    {task.completed ? (
                      <span> (Completato)</span>
                    ) : (
                      <>
                        <Button variant="success" onClick={() => handleTaskCompletion(task._id, true)}>Completa</Button>
                        {new Date(task.deadline) < new Date() && (
                          <span className="text-danger"> (In ritardo)</span>
                        )}
                      </>
                    )}
                    <Button variant="danger" onClick={() => handleEntryDelete(task._id, 'task')}>Elimina</Button>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CalendarComponent;
