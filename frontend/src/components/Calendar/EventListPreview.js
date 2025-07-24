import React, { useEffect } from 'react';
import { ListGroup, Row, Col } from 'react-bootstrap';
import { useTimeMachine } from '../../TimeMachineContext';

const EventListPreview = ({ events, onEventUpdate }) => {
  const { virtualTime } = useTimeMachine();

  // Funzione per abbreviare il titolo
  const abbreviateTitle = (title, maxLength = 10) => { 
  return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
};

  const getTodaysEvents = (events, currentDate) => {
    const today = currentDate.toISOString().slice(0, 10);
    return events.filter(event => {
      const eventStart = new Date(event.startDate).toISOString().slice(0, 10);
      const eventEnd = new Date(event.endDate).toISOString().slice(0, 10);
      return today >= eventStart && today <= eventEnd;
    });
  };

  const getWeeklyEvents = (events, currentDate) => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Lunedì
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Domenica
    endOfWeek.setHours(23, 59, 59, 999);

    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return (
        (eventStart >= startOfWeek && eventStart <= endOfWeek) ||
        (eventEnd >= startOfWeek && eventEnd <= endOfWeek) ||
        (eventStart <= startOfWeek && eventEnd >= endOfWeek)
      );
    });
  };

  useEffect(() => {}, [virtualTime]);

  const currentDate = new Date(virtualTime || new Date());
  const todaysEvents = getTodaysEvents(events, currentDate);
  const weeklyEvents = getWeeklyEvents(events, currentDate);

  return (
    <div className="text-center">
      {/* EVENTI DI OGGI */}
      <h2 className="mb-4">Eventi di Oggi</h2>
      <ListGroup className="w-75 mx-auto">
        {/* Header desktop per eventi di oggi */}
        <ListGroup.Item className="d-none d-md-block text-center bg-primary text-white">
          <Row>
            <Col>Titolo</Col>
            <Col>Luogo</Col>
            <Col>Durata</Col>
          </Row>
        </ListGroup.Item>
        
        {/* Header mobile per eventi di oggi */}
        <ListGroup.Item className="d-block d-md-none text-center bg-primary text-white">
          <Row>
            <Col>Titolo</Col>
            <Col>Durata</Col>
          </Row>
        </ListGroup.Item>

        {todaysEvents.length > 0 ? (
          todaysEvents.map(event => (
            <ListGroup.Item key={event._id}>
              {/* Vista desktop */}
              <div className="d-none d-md-block">
                <Row>
                  <Col><strong>{abbreviateTitle(event.title, 10)}</strong></Col>
                  <Col>{event.location || 'Nessuna posizione'}</Col>
                  <Col>
                    {event.startTime
                      ? `${event.startTime} - ${event.endTime || ''}`
                      : 'Tutto il giorno'}
                  </Col>
                </Row>
              </div>
              
              {/* Vista mobile */}
              <div className="d-block d-md-none">
                <Row className="align-items-center">
                  <Col>
                    <strong>{abbreviateTitle(event.title, 7)}</strong>
                  </Col>
                  <Col>
                    <small>
                      {event.startTime
                        ? `${event.startTime} - ${event.endTime || ''}`
                        : 'Tutto il giorno'}
                    </small>
                  </Col>
                </Row>
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>Nessun evento per oggi</ListGroup.Item>
        )}
      </ListGroup>

      {/* EVENTI DELLA SETTIMANA */}
      <h2 className="mt-4 mb-4">Eventi della Settimana</h2>
      <ListGroup className="w-75 mx-auto">
        {/* Header desktop per eventi della settimana */}
        <ListGroup.Item className="d-none d-md-block text-center bg-primary text-white">
          <Row>
            <Col>Titolo</Col>
            <Col>Luogo</Col>
            <Col>Giorno</Col>
            <Col>Durata</Col>
          </Row>
        </ListGroup.Item>
        
        {/* Header mobile per eventi della settimana */}
        <ListGroup.Item className="d-block d-md-none text-center bg-primary text-white">
          <Row>
            <Col>Titolo</Col>
            <Col>Giorno</Col>
            <Col>Durata</Col>
          </Row>
        </ListGroup.Item>

        {weeklyEvents.length > 0 ? (
          weeklyEvents.map(event => {
            const eventDay = new Date(event.startDate).toLocaleDateString('it-IT', {
              weekday: 'short', // Versione abbreviata per mobile
            });
            return (
              <ListGroup.Item key={event._id}>
                {/* Vista desktop */}
                <div className="d-none d-md-block">
                  <Row>
                    <Col><strong>{abbreviateTitle(event.title, 10)}</strong></Col>
                    <Col>{event.location || 'Nessuna posizione'}</Col>
                    <Col>{new Date(event.startDate).toLocaleDateString('it-IT', { weekday: 'long' })}</Col>
                    <Col>
                      {event.startTime
                        ? `${event.startTime} - ${event.endTime || ''}`
                        : 'Tutto il giorno'}
                    </Col>
                  </Row>
                </div>
                
                {/* Vista mobile */}
                <div className="d-block d-md-none">
                  <Row className="align-items-center">
                    <Col>
                      <strong>{abbreviateTitle(event.title, 7)}</strong>
                    </Col>
                    <Col>
                      <small>{eventDay}</small>
                    </Col>
                    <Col>
                      <small>
                        {event.startTime
                          ? `${event.startTime.substring(0, 5)}-${event.endTime?.substring(0, 5) || ''}`
                          : 'Tutto il giorno'}
                      </small>
                    </Col>
                  </Row>
                </div>
              </ListGroup.Item>
            );
          })
        ) : (
          <ListGroup.Item>Nessun evento per questa settimana</ListGroup.Item>
        )}
      </ListGroup>
    </div>
  );
};

export default EventListPreview;