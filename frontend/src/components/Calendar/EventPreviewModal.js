import React from 'react';
import { Modal, Button, ListGroup, Row, Col } from 'react-bootstrap';
import SingleTaskPreview from './SingleTaskPreview.js'
import SingleEventPreview from './SingleEventPreview.js'

const EventPreviewModal = ({ show, handleClose, selectedDate, events, tasks, openEventModal, openTaskModal, handleDeleteEvent, handleDeleteTask }) => {
  const selectedDateString = new Date(selectedDate).toDateString();

  // Filtra gli eventi per la data selezionata
  const eventsForSelectedDate = events.filter(event => {
    const eventStartDate = new Date(event.startDate).toDateString();
    return eventStartDate === selectedDateString;
  });

  // Filtra le attività per la data selezionata
  const tasksForSelectedDate = tasks.filter(task => {
    const taskDeadline = new Date(task.deadline).toDateString();
    return taskDeadline === selectedDateString;
  });

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Elementi per {new Date(selectedDate).toLocaleDateString()}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Pulsanti per creare eventi e attività */}
        <div className="d-flex justify-content-around mb-3">
          <Button variant="primary" onClick={openEventModal}>Crea Evento</Button>
          <Button variant="secondary" onClick={openTaskModal}>Crea Attività</Button>
        </div>

        {/* Lista degli eventi per la data selezionata */}
        {eventsForSelectedDate.length > 0 ? (
          <ListGroup>
            {eventsForSelectedDate.map(event => (
              <ListGroup.Item key={event._id} className="mb-3">
                <SingleEventPreview event={event}></SingleEventPreview>
              </ListGroup.Item>
              // <ListGroup.Item key={event._id} className="mb-3">
              //   <h5>{event.title}</h5>
              //   <p><strong>Tipo:</strong> Evento</p>
              //   <Row>
              //     <Col>
              //       {event.isAllDay ? (
              //         <p><strong>Tutto il giorno</strong></p>
              //       ) : (
              //         <p>
              //           <strong>Data di Fine:</strong> {event.endDate.slice(0, 10)} <br />
              //           <strong>Orario di Inizio:</strong> {event.startTime} <br />
              //           <strong>Orario di Fine:</strong> {event.endTime}
              //         </p>
              //       )}
              //       {event.location && <p><strong>Luogo:</strong> {event.location}</p>}
              //     </Col>
              //     <Col className="text-end">
              //       <Button  variant="warning" className="me-2">Modifica</Button>
              //       <Button  variant="danger" onClick={() => handleDeleteEvent(event._id)}>Elimina</Button>
              //     </Col>
              //   </Row>

              // </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>Nessun evento per questa data.</p>
        )}

        {/* Lista delle attività per la data selezionata */}
        {tasksForSelectedDate.length > 0 ? (
          <ListGroup>
            {tasksForSelectedDate.map(task => (
              <ListGroup.Item key={task._id} className="mb-3">
                <SingleTaskPreview task={task}></SingleTaskPreview>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>Nessuna attività per questa data.</p>
        )}
      </Modal.Body>

    </Modal>
  );
};

export default EventPreviewModal;
