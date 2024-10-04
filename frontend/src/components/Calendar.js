// import React, { useState, useEffect } from 'react';
// import { Container, Button, Modal, Form, Row, Col } from 'react-bootstrap';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import NavigationBar from './Navbar'; 
// import './CalendarStyles.css';

// const CalendarComponent = () => {
//   const [events, setEvents] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [showFormModal, setShowFormModal] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [formType, setFormType] = useState(''); // 'event' o 'task'

//   const [newEvent, setNewEvent] = useState({
//     title: '',
//     date: '',
//     time: '',
//     endDate: '',
//     endTime: '',
//     location: '',
//     recurrence: '',
//     repeatCount: '',
//     repeatUntil: '',
//     notifications: [],
//     notificationTime: '',
//     notificationRepeat: '',
//   });

//   const [newTask, setNewTask] = useState({
//     title: '',
//     deadlineDate: '',
//     deadlineTime: '',
//     notifications: [],
//     completed: false,
//   });

//   useEffect(() => {
//     fetchEvents();
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     const token = localStorage.getItem('token');

//     try {
//         const response = await fetch('http://localhost:3000/user/getUserData', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             }
//         });

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         const result = await response.json();
//         const taskIds = result.user.userTask || [];

//         const taskPromises = taskIds.map(async (id) => {
//             const taskResponse = await fetch(`http://localhost:3000/tasks/${id}`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 }
//             });

//             if (!taskResponse.ok) {
//                 throw new Error('Network response was not ok');
//             }

//             const task = await taskResponse.json();

//             return task.task;
//         });

//         const tasks = await Promise.all(taskPromises);
//         setTasks(tasks);
//     } catch (error) {
//         console.error('There was a BAD problem with the fetch operation:', error);
//     } finally {
//         setLoading(false);
//     }
//   };

//   const fetchEvents = async () => {
//     const token = localStorage.getItem('token');

//     try {
//         const response = await fetch('http://localhost:3000/user/getUserData', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             }
//         });

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         const result = await response.json();
//         const eventIds = result.user.userEvent || [];

//         const eventPromises = eventIds.map(async (id) => {
//             const eventResponse = await fetch(`http://localhost:3000/events/${id}`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 }
//             });

//             if (!eventResponse.ok) {
//                 throw new Error('Network response was not ok');
//             }

//             const event = await eventResponse.json();

//             return event.event;
//         });

//         const events = await Promise.all(eventPromises);
//         setEvents(events);
//     } catch (error) {
//         console.error('There was a BAD problem with the fetch operation:', error);
//     } finally {
//         setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     try{
//       if (formType === 'event') {
//         const response = await fetch('http://localhost:3000/events/create', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${localStorage.getItem('token')}`
//           },
//           body: JSON.stringify(e)
//         });
  
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
  
//         setShowModal(false);
//         window.location.reload(); // Refresh event after creation
//       } else if (formType === 'task') {
//         const response = await fetch('http://localhost:3000/tasks/create', {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${localStorage.getItem('token')}`
//           },
//           body: JSON.stringify(e)
//         });
  
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
  
//         setShowModal(false);
//         window.location.reload(); // Refresh task after creation
//       }
      
//     } catch (error) {
//         console.error('There was a problem with the fetch operation:', error);
//     }
    
//   };

//   const resetForm = () => {
//     setNewEvent({
//       title: '',
//       date: '',
//       time: '',
//       endDate: '',
//       endTime: '',
//       location: '',
//       recurrence: '',
//       repeatCount: '',
//       repeatUntil: '',
//       notifications: [],
//       notificationTime: '',
//       notificationRepeat: '',
//     });
//     setNewTask({
//       title: '',
//       deadlineDate: selectedDate.toISOString().split('T')[0], 
//       deadlineTime: '',
//       notifications: [],
//       completed: false,
//     });
//   };

//   const openFormModal = (type) => {
//     setFormType(type);
//     resetForm(); // Resetta il form con la data selezionata
//     if (type === 'event') {
//       setNewEvent({
//         ...newEvent,
//         date: selectedDate.toISOString().split('T')[0], 
//       });
//     } else if (type === 'task') {
//       setNewTask({
//         ...newTask,
//         deadlineDate: selectedDate.toISOString().split('T')[0], 
//       });
//     }
//     setShowFormModal(true);
//   };

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//   };

//   return (
//     <Container fluid>
//       <NavigationBar isAuthenticated={true} />

//       <Row className="justify-content-center mt-4">
//         <Col xs={12} md={8} lg={3}> 
//           <div className="mb-3 text-center button-group">
//             <Button variant="primary" onClick={() => openFormModal('event')}>
//               Crea Evento
//             </Button>
//             <Button variant="secondary" onClick={() => openFormModal('task')} className="ml-2">
//               Crea Attività
//             </Button>
//           </div>
//           <div className="calendar-container">
//             <Calendar
//               onChange={handleDateChange}
//               value={selectedDate}
//               tileContent={({ date, view }) => (
//                 <div>
//                   {view === 'month' && events.map(event => (
//                     new Date(event.startDate) <= date && new Date(event.endDate) >= date && (
//                       <div key={event._id} className="event-marker">{event.title}</div>
//                     )
//                   ))}
//                   {view === 'month' && tasks.map(task => (
//                     new Date(task.deadline).toDateString() === date.toDateString() && (
//                       <div key={task._id} className="task-marker">{task.title} (Scadenza)</div>
//                     )
//                   ))}
//                 </div>
//               )}
//             />
//           </div>
//         </Col>
//       </Row>

//       {/* Modal per aggiungere un evento */}
//       <Modal show={showFormModal && formType === 'event'} onHide={() => setShowFormModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Aggiungi Evento</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSubmit}>
//           <Form.Group controlId="formTitle">
//               <Form.Label>Titolo</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Inserisci il titolo"
//                 value={newEvent.title}
//                 onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
//               />
//             </Form.Group>
//             <Form.Group controlId="formDate">
//               <Form.Label>Data Inizio</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={newEvent.date}
//                 onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
//               />
//             </Form.Group>
//             <Form.Group controlId="formTime">
//               <Form.Label>Ora Inizio</Form.Label>
//               <Form.Control
//                 type="time"
//                 value={newEvent.time}
//                 onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
//               />
//             </Form.Group>
//             <Form.Group controlId="formEndDate">
//               <Form.Label>Data Fine</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={newEvent.endDate}
//                 onChange={e => setNewEvent({ ...newEvent, endDate: e.target.value })}
//               />
//             </Form.Group>
//             <Form.Group controlId="formEndTime">
//               <Form.Label>Ora Fine</Form.Label>
//               <Form.Control
//                 type="time"
//                 value={newEvent.endTime}
//                 onChange={e => setNewEvent({ ...newEvent, endTime: e.target.value })}
//               />
//             </Form.Group>
//             <Form.Group controlId="formRecurrence">
//               <Form.Label>Frequenza</Form.Label>
//               <Form.Control
//                 as="select"
//                 value={newEvent.recurrence}
//                 onChange={e => setNewEvent({ ...newEvent, recurrence: e.target.value })}
//               >
//                 <option value="">Nessuna</option>
//                 <option value="daily">Giornaliera</option>
//                 <option value="weekly">Settimanale</option>
//                 <option value="monthly">Mensile</option>
//                 <option value="custom">Personalizzata</option>
//               </Form.Control>
//             </Form.Group>
//             {newEvent.recurrence === 'custom' && (
//               <Form.Group controlId="formCustomRecurrence">
//                 <Form.Label>Recorrenza Personalizzata</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="Descrivi la ricorrenza es. 'ogni martedì e giovedì'"
//                   value={newEvent.customRecurrence}
//                   onChange={e => setNewEvent({ ...newEvent, customRecurrence: e.target.value })}
//                 />
//               </Form.Group>
//             )}
//             <Form.Group controlId="formRepeatCount">
//               <Form.Label>Ripeti</Form.Label>
//               <Form.Control
//                 as="select"
//                 value={newEvent.repeatCount}
//                 onChange={e => setNewEvent({ ...newEvent, repeatCount: e.target.value })}
//               >
//                 <option value="">Indefinitamente</option>
//                 <option value="n_times">N volte</option>
//                 <option value="until_date">Fino alla data</option>
//               </Form.Control>
//               {newEvent.repeatCount === 'n_times' && (
//                 <Form.Control
//                   type="number"
//                   placeholder="Numero di ripetizioni"
//                   onChange={e => setNewEvent({ ...newEvent, repeatCountValue: e.target.value })}
//                 />
//               )}
//               {newEvent.repeatCount === 'until_date' && (
//                 <Form.Control
//                   type="date"
//                   onChange={e => setNewEvent({ ...newEvent, repeatUntil: e.target.value })}
//                 />
//               )}
//             </Form.Group>
//             <Form.Group controlId="formNotificationMethod">
//               <Form.Label>Notifica</Form.Label>
//               <Form.Control
//                 as="select"
//                 value={newEvent.notifications.method}
//                 onChange={e => setNewEvent({ ...newEvent, notifications: { ...newEvent.notifications, method: e.target.value } })}
//               >
//                 <option value="alert">Alert</option>
//                 <option value="system">Sistema</option>
//                 <option value="email">Email</option>
//               </Form.Control>
//             </Form.Group>
//             <Form.Group controlId="formNotificationTime">
//               <Form.Label>Quando ricevere la notifica</Form.Label>
//               <Form.Control
//                 as="select"
//                 value={newEvent.notificationTime}
//                 onChange={e => setNewEvent({ ...newEvent, notificationTime: e.target.value })}
//               >
//                 <option value="">All'ora dell'evento</option>
//                 <option value="1_minute">1 minuto prima</option>
//                 <option value="5_minutes">5 minuti prima</option>
//                 <option value="1_hour">1 ora prima</option>
//                 <option value="2_hours">2 ore prima</option>
//                 <option value="1_day">1 giorno prima</option>
//                 <option value="2_days">2 giorni prima</option>
//               </Form.Control>
//             </Form.Group>
//             <Form.Group controlId="formNotificationRepeat">
//               <Form.Label>Ripetizione della Notifica</Form.Label>
//               <Form.Control
//                 as="select"
//                 value={newEvent.notificationRepeat}
//                 onChange={e => setNewEvent({ ...newEvent, notificationRepeat: e.target.value })}
//               >
//                 <option value="">Non ripetere</option>
//                 <option value="every_minute">Ogni minuto</option>
//                 <option value="every_hour">Ogni ora</option>
//                 <option value="until_response">Fino a risposta</option>
//               </Form.Control>
//             </Form.Group>
//             <Button variant="primary" type="submit">
//               Salva Evento
//             </Button>
//           </Form>
//         </Modal.Body>
//       </Modal>

//       {/* Modal per aggiungere un'attività */}
//       <Modal show={showFormModal && formType === 'task'} onHide={() => setShowFormModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Aggiungi Attività</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSubmit}>
//           <Form.Group controlId="formTitle">
//               <Form.Label>Titolo</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Inserisci il titolo"
//                 value={newTask.title}
//                 onChange={e => setNewTask({ ...newTask, title: e.target.value })}
//               />
//             </Form.Group>
//             <Form.Group controlId="formDeadlineDate">
//               <Form.Label>Data Scadenza</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={newTask.deadlineDate}
//                 onChange={e => setNewTask({ ...newTask, deadlineDate: e.target.value })}
//               />
//             </Form.Group>
//             <Form.Group controlId="formDeadlineTime">
//               <Form.Label>Ora Scadenza</Form.Label>
//               <Form.Control
//                 type="time"
//                 value={newTask.deadlineTime}
//                 onChange={e => setNewTask({ ...newTask, deadlineTime: e.target.value })}
//               />
//             </Form.Group>
//             <Button variant="primary" type="submit">
//               Salva Attività
//             </Button>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </Container>
//   );
// };

// export default CalendarComponent;


import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import NavigationBar from './Navbar'; 
import './CalendarStyles.css';

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formType, setFormType] = useState(''); // 'event' o 'task'

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

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:3000/user/getUserData', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        const taskIds = result.user.userTask || [];

        const taskPromises = taskIds.map(async (id) => {
            const taskResponse = await fetch(`http://localhost:3000/tasks/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!taskResponse.ok) {
                throw new Error('Network response was not ok');
            }

            const task = await taskResponse.json();

            return task.task;
        });

        const tasks = await Promise.all(taskPromises);
        setTasks(tasks);
    } catch (error) {
        console.error('There was a BAD problem with the fetch operation:', error);
    }
  };

  const fetchEvents = async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:3000/user/getUserData', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        const eventIds = result.user.userEvent || [];

        const eventPromises = eventIds.map(async (id) => {
            const eventResponse = await fetch(`http://localhost:3000/events/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!eventResponse.ok) {
                throw new Error('Network response was not ok');
            }

            const event = await eventResponse.json();

            return event.event;
        });

        const events = await Promise.all(eventPromises);
        setEvents(events);
    } catch (error) {
        console.error('There was a BAD problem with the fetch operation:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission behavior

    try {
      if (formType === 'event') {
        const response = await fetch('http://localhost:3000/events/create', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(newEvent)  // Send the newEvent data
        });
  
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
  
        setShowFormModal(false);
        window.location.reload(); // Refresh event after creation
      } else if (formType === 'task') {
        const response = await fetch('http://localhost:3000/tasks/create', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(newTask)  // Send the newTask data
        });
  
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
  
        setShowFormModal(false);
        window.location.reload(); // Refresh task after creation
      }
      
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
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
      deadlineDate: selectedDate.toISOString().split('T')[0], 
      deadlineTime: '',
      notifications: [],
      completed: false,
    });
  };

  const openFormModal = (type) => {
    setFormType(type);
    resetForm(); // Resetta il form con la data selezionata
    if (type === 'event') {
      setNewEvent({
        ...newEvent,
        date: selectedDate.toISOString().split('T')[0], 
      });
    } else if (type === 'task') {
      setNewTask({
        ...newTask,
        deadlineDate: selectedDate.toISOString().split('T')[0], 
      });
    }
    setShowFormModal(true);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <Container fluid>
      <NavigationBar isAuthenticated={true} />

      <Row className="justify-content-center mt-4">
        <Col xs={12} md={8} lg={3}> 
          <div className="mb-3 text-center button-group">
            <Button variant="primary" onClick={() => openFormModal('event')}>
              Crea Evento
            </Button>
            <Button variant="secondary" onClick={() => openFormModal('task')} className="ml-2">
              Crea Attività
            </Button>
          </div>
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
            <Form.Group controlId="formLocation">
              <Form.Label>Luogo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Inserisci il luogo"
                value={newEvent.location}
                onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </Form.Group>
            {/* Aggiungere altri campi del form se necessario */}
            <Button variant="primary" type="submit">
              Aggiungi Evento
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal per aggiungere un task */}
      <Modal show={showFormModal && formType === 'task'} onHide={() => setShowFormModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Aggiungi Attività</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTaskTitle">
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
            {/* Aggiungere altri campi del form se necessario */}
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
