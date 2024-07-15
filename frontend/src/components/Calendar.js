import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Navbar, Nav, Button, Modal, Form } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', startDate: '', endDate: '', location: '', isAllDay: false });

  useEffect(() => {
    const fetchEvents = async () => {
      const result = await axios.get('http://localhost:3000/events');
      setEvents(result.data);
    };
    fetchEvents();
  }, []);

  const handleEventClick = (info) => {
    alert('Event: ' + info.event.title);
  };

  const handleDateClick = (info) => {
    setNewEvent({ ...newEvent, startDate: info.dateStr, endDate: info.dateStr });
    setShowModal(true);
  };

  const handleSave = async () => {
    await axios.post('http://localhost:3000/events', newEvent);
    setEvents([...events, newEvent]);
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
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
      />
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEventTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventStart" className="mt-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={newEvent.startDate}
                onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventEnd" className="mt-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={newEvent.endDate}
                onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventLocation" className="mt-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEventAllDay" className="mt-3">
              <Form.Check
                type="checkbox"
                label="All Day"
                checked={newEvent.isAllDay}
                onChange={(e) => setNewEvent({ ...newEvent, isAllDay: e.target.checked })}
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

export default Calendar;
