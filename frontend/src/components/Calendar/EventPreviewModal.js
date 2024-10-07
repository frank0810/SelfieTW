import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';

const EventPreviewModal = ({ show, handleClose, selectedDate, events, openEventModal, openTaskModal }) => {
  // Filtra gli eventi per la data selezionata
  const eventsForSelectedDate = events.filter(event => {
    const eventStartDate = new Date(event.startDate).toDateString();
    const selectedDateString = new Date(selectedDate).toDateString();
    return eventStartDate === selectedDateString;
  });

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Eventi per {new Date(selectedDate).toLocaleDateString()}</Modal.Title>
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
              <ListGroup.Item key={event._id}>
                <h5>{event.title}</h5>
                {event.isAllDay ? (
                  <p><strong>Tutto il giorno</strong></p>
                ) : (
                  <p>
                    <strong>Data di Fine:</strong> {event.endDate.slice(0,10)} <br/>
                    <strong>Orario di Inizio:</strong> {event.startTime} <br />
                    <strong>Orario di Fine:</strong> {event.endTime}
                  </p>
                )}
                {event.location && <p><strong>Luogo:</strong> {event.location}</p>}
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>Nessun evento per questa data.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Chiudi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventPreviewModal;
