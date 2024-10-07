import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CreateEventModal from './CreateEventModal';
import CreateTaskModal from './CreateTaskModal';
import TaskListComponent from './TaskListComponent';
import EventPreviewModal from './EventPreviewModal';
import NavigationBar from '../Navbar';
import { useTimeMachine } from '../../TimeMachineContext';
import './CalendarStyles.css';

const CalendarComponent = () => {
    const { virtualTime } = useTimeMachine();
    const [events, setEvents] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showEventModal, setShowEventModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showEventPreviewModal, setShowEventPreviewModal] = useState(false);

    // Carica eventi e attività
    useEffect(() => {
        fetchEvents();
        fetchTasks();
    }, [virtualTime]);

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
            const eventIds = result.user.userEvents || [];

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
            const taskIds = result.user.userTasks || [];

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

    // Gestione selezione data nel calendario
    const handleDateClick = (date) => {
        setSelectedDate(date);
        setShowEventPreviewModal(true);
    };

    // Apre il modal per creare nuovi eventi
    const openEventModal = () => {
        setShowEventPreviewModal(false);  // Chiude l'anteprima degli eventi
        setShowEventModal(true);          // Apre il modal per creare eventi
    };

    // Apre il modal per creare nuove attività
    const openTaskModal = () => {
        setShowEventPreviewModal(false);  // Chiude l'anteprima degli eventi
        setShowTaskModal(true);           // Apre il modal per creare attività
    };

    // Modale per creare nuovi eventi
    const handleCreateEvent = async (newEvent) => {
        try {
            const response = await fetch('http://localhost:3000/events/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newEvent)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setShowEventModal(false);
            window.location.reload();
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    // Modale per creare nuove attività
    const handleCreateTask = async (newTask) => {
        try {
            const response = await fetch('http://localhost:3000/tasks/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newTask)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setShowTaskModal(false);
            window.location.reload();
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

     // Controlla se la data ha eventi o scadenze di attività
     const hasEventsOrTasks = (date) => {
        const dateString = date.toDateString();  // Usa la rappresentazione locale della data
        return (
            events.some(event => new Date(event.startDate).toDateString() === dateString) ||
            tasks.some(task => new Date(task.deadline).toDateString() === dateString)
        );
    };

    return (
        <>
            <NavigationBar isAuthenticated={true} />
            <Container fluid>
                <Row className="justify-content-center mt-4">
                    <Col xs={12} md={8} lg={3}>
                        <div className="calendar-container">
                            <Calendar
                                onChange={handleDateClick}
                                value={selectedDate}
                                tileContent={({ date }) => hasEventsOrTasks(date) ? <div className="highlight"></div> : null}
                            />
                        </div>
                    </Col>
                </Row>

                {/* Task List sotto il calendario */}
                <Row className="mt-4">
                    <TaskListComponent tasks={tasks} />
                </Row>

                {/* Modali */}
                <CreateEventModal
                    show={showEventModal}
                    handleClose={() => setShowEventModal(false)}
                    handleCreate={handleCreateEvent}
                    defaultStartDate={selectedDate}  // Imposta la data selezionata come data di default
                />
                <CreateTaskModal
                    show={showTaskModal}
                    handleClose={() => setShowTaskModal(false)}
                    handleCreate={handleCreateTask}
                    defaultDeadline={selectedDate}  // Imposta la data selezionata come scadenza di default
                />
                <EventPreviewModal
                    selectedDate={selectedDate}
                    show={showEventPreviewModal}
                    handleClose={() => setShowEventPreviewModal(false)}
                    events={events}
                    tasks={tasks}
                    openEventModal={openEventModal}  // Passa la funzione per aprire il modal degli eventi
                    openTaskModal={openTaskModal}    // Passa la funzione per aprire il modal delle attività
                />
            </Container>
        </>
    );
};

export default CalendarComponent;
