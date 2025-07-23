// import React, { useEffect } from 'react';
// import { ListGroup, Row, Col } from 'react-bootstrap';
// import { useTimeMachine } from '../../TimeMachineContext';

// const EventListPreview = ({ events }) => {
//   const { virtualTime } = useTimeMachine();

//   const getTodaysEvents = (events, currentDate) => {
//     const today = currentDate.toISOString().slice(0, 10);
//     return events.filter(event => {
//       const eventStart = new Date(event.startDate).toISOString().slice(0, 10);
//       const eventEnd = new Date(event.endDate).toISOString().slice(0, 10);
//       return today >= eventStart && today <= eventEnd;
//     });
//   };

//   const getWeeklyEvents = (events, currentDate) => {
//     const startOfWeek = new Date(currentDate);
//     startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Lunedì
//     startOfWeek.setHours(0, 0, 0, 0);

//     const endOfWeek = new Date(startOfWeek);
//     endOfWeek.setDate(startOfWeek.getDate() + 6); // Domenica
//     endOfWeek.setHours(23, 59, 59, 999);

//     return events.filter(event => {
//       const eventStart = new Date(event.startDate);
//       const eventEnd = new Date(event.endDate);
//       return (
//         (eventStart >= startOfWeek && eventStart <= endOfWeek) ||
//         (eventEnd >= startOfWeek && eventEnd <= endOfWeek) ||
//         (eventStart <= startOfWeek && eventEnd >= endOfWeek)
//       );
//     });
//   };

//   useEffect(() => {}, [virtualTime]);

//   const currentDate = new Date(virtualTime || new Date());
//   const todaysEvents = getTodaysEvents(events, currentDate);
//   const weeklyEvents = getWeeklyEvents(events, currentDate);

//   return (
//     <div className="text-center">
//       <h2 className="mb-4">Eventi di Oggi</h2>
//       <ListGroup className="w-75 mx-auto">
//         <ListGroup.Item className="text-center bg-primary text-white">
//           <Row>
//             <Col>Titolo</Col>
//             <Col>Luogo</Col>
//             <Col>Durata</Col>
//           </Row>
//         </ListGroup.Item>
//         {todaysEvents.length > 0 ? (
//           todaysEvents.map(event => (
//             <ListGroup.Item key={event._id}>
//               <Row>
//                 <Col><strong>{event.title}</strong></Col>
//                 <Col>{event.location || 'Nessuna posizione'}</Col>
//                 <Col>
//                   {event.startTime
//                     ? `${event.startTime} - ${event.endTime || ''}`
//                     : 'Tutto il giorno'}
//                 </Col>
//               </Row>
//             </ListGroup.Item>
//           ))
//         ) : (
//           <ListGroup.Item>Nessun evento per oggi</ListGroup.Item>
//         )}
//       </ListGroup>

//       <h2 className="mt-4 mb-4">Eventi della Settimana</h2>
//       <ListGroup className="w-75 mx-auto">
//         <ListGroup.Item className="text-center bg-primary text-white">
//           <Row>
//             <Col>Titolo</Col>
//             <Col>Luogo</Col>
//             <Col>Giorno</Col>
//             <Col>Durata</Col>
//           </Row>
//         </ListGroup.Item>
//         {weeklyEvents.length > 0 ? (
//           weeklyEvents.map(event => {
//             const eventDay = new Date(event.startDate).toLocaleDateString('it-IT', {
//               weekday: 'long', // mi dice il giorno della settimana
//             });
//             return (
//               <ListGroup.Item key={event._id}>
//                 <Row>
//                   <Col><strong>{event.title}</strong></Col>
//                   <Col>{event.location || 'Nessuna posizione'}</Col>
//                   <Col>{eventDay}</Col>
//                   <Col>
//                     {event.startTime
//                       ? `${event.startTime} - ${event.endTime || ''}`
//                       : 'Tutto il giorno'}
//                   </Col>
//                 </Row>
//               </ListGroup.Item>
//             );
//           })
//         ) : (
//           <ListGroup.Item>Nessun evento per questa settimana</ListGroup.Item>
//         )}
//       </ListGroup>
//     </div>
//   );
// };

// export default EventListPreview;

import React, { useEffect } from 'react';
import { ListGroup, Row, Col } from 'react-bootstrap';
import { useTimeMachine } from '../../TimeMachineContext';

const EventListPreview = ({ events, onEditEvent }) => {
  const { virtualTime } = useTimeMachine();

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

  const truncateTitle = (title, maxLength = 20) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  useEffect(() => {}, [virtualTime]);

  const currentDate = new Date(virtualTime || new Date());
  const todaysEvents = getTodaysEvents(events, currentDate);
  const weeklyEvents = getWeeklyEvents(events, currentDate);

  return (
    <div className="text-center">
      <h2 className="mb-4">Eventi di Oggi</h2>
      <ListGroup className="w-75 mx-auto">
        {/* Header - visibile solo su desktop */}
        <ListGroup.Item className="text-center bg-primary text-white d-none d-md-block">
          <Row>
            <Col>Titolo</Col>
            <Col>Luogo</Col>
            <Col>Durata</Col>
          </Row>
        </ListGroup.Item>
        
        {todaysEvents.length > 0 ? (
          todaysEvents.map(event => (
            <ListGroup.Item key={event._id}>
              {/* Desktop View */}
              <Row className="d-none d-md-flex">
                <Col><strong>{event.title}</strong></Col>
                <Col>{event.location || 'Nessuna posizione'}</Col>
                <Col>
                  {event.startTime
                    ? `${event.startTime} - ${event.endTime || ''}`
                    : 'Tutto il giorno'}
                </Col>
              </Row>
              
              {/* Mobile View */}
              <div className="d-md-none">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="flex-grow-1">
                    <div className="fw-bold text-start">
                      {truncateTitle(event.title)}
                    </div>
                    <div className="text-muted small text-start">
                      {event.startTime
                        ? `${event.startTime} - ${event.endTime || ''}`
                        : 'Tutto il giorno'}
                    </div>
                  </div>
                  <button 
                    className="btn btn-link p-0 ms-2"
                    onClick={() => onEditEvent && onEditEvent(event)}
                    style={{ fontSize: '1.2em' }}
                  >
                    ✏️
                  </button>
                </div>
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>Nessun evento per oggi</ListGroup.Item>
        )}
      </ListGroup>

      <h2 className="mt-4 mb-4">Eventi della Settimana</h2>
      <ListGroup className="w-75 mx-auto">
        {/* Header - visibile solo su desktop */}
        <ListGroup.Item className="text-center bg-primary text-white d-none d-md-block">
          <Row>
            <Col>Titolo</Col>
            <Col>Luogo</Col>
            <Col>Giorno</Col>
            <Col>Durata</Col>
          </Row>
        </ListGroup.Item>
        
        {weeklyEvents.length > 0 ? (
          weeklyEvents.map(event => {
            const eventDay = new Date(event.startDate).toLocaleDateString('it-IT', {
              weekday: 'long',
            });
            return (
              <ListGroup.Item key={event._id}>
                {/* Desktop View */}
                <Row className="d-none d-md-flex">
                  <Col><strong>{event.title}</strong></Col>
                  <Col>{event.location || 'Nessuna posizione'}</Col>
                  <Col>{eventDay}</Col>
                  <Col>
                    {event.startTime
                      ? `${event.startTime} - ${event.endTime || ''}`
                      : 'Tutto il giorno'}
                  </Col>
                </Row>
                
                {/* Mobile View */}
                <div className="d-md-none">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="flex-grow-1">
                      <div className="fw-bold text-start">
                        {truncateTitle(event.title)}
                      </div>
                      <div className="text-muted small text-start">
                        <span className="me-2">{eventDay}</span>
                        {event.startTime
                          ? `${event.startTime} - ${event.endTime || ''}`
                          : 'Tutto il giorno'}
                      </div>
                    </div>
                    <button 
                      className="btn btn-link p-0 ms-2"
                      onClick={() => onEditEvent && onEditEvent(event)}
                      style={{ fontSize: '1.2em' }}
                    >
                      ✏️
                    </button>
                  </div>
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