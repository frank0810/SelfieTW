import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import SingleTaskPreview from './SingleTaskPreview.js'
import SingleEventPreview from './SingleEventPreview.js'

const EventPreviewModal = ({ show, handleClose, selectedDate, events, tasks, openEventModal, openTaskModal, handleDeleteEvent, handleDeleteTask }) => {
  const selectedDateString = new Date(selectedDate).toDateString();

  // Filtra gli eventi per la data selezionata
  const eventsForSelectedDate = events.filter(event => {
    const eventStartDate = new Date(event.startDate).toDateString();
    const eventEndDate = new Date(event.endDate).toDateString();
    return new Date(eventStartDate) <= new Date(selectedDateString) && new Date(selectedDateString) <= new Date(eventEndDate);
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

        <div className="d-flex justify-content-around mb-3">
          <Button variant="primary" onClick={openEventModal}>Crea Evento</Button>
          <Button variant="secondary" onClick={openTaskModal}>Crea Attività</Button>
        </div>

        {eventsForSelectedDate.length > 0 ? (
          <ListGroup>
            {eventsForSelectedDate.map(event => {
              let timeType = 'intermediate';
              if (new Date(event.startDate).toDateString() === selectedDateString) {
                timeType = 'start';
              } else if (new Date(event.endDate).toDateString() === selectedDateString) {
                timeType = 'end';
              }
              return (
                <ListGroup.Item key={event._id} className="mb-3">
                  <SingleEventPreview event={event} timeType={timeType} />
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        ) : (
          <p>Nessun evento per questa data.</p>
        )}


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
