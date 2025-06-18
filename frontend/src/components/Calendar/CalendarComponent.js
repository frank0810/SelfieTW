import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Calendar from 'react-calendar';
import EventListPreview from './EventListPreview';
import 'react-calendar/dist/Calendar.css';
import CreateEventModal from './CreateEventModal';
import CreateTaskModal from './CreateTaskModal';
import TaskListComponent from './TaskListComponent';
import EventPreviewModal from './EventPreviewModal';
//import NavigationBar from '../Navbar';
import { useTimeMachine } from '../../TimeMachineContext';
import './CalendarStyles.css';
import ResponsiveNavbar from '../NavBar/ResponsiveNavbar';

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

    //HANDLE REPETITIONS per creare delle ripetizioni

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

                // Calcolo e formatto le date
                const startDate = new Date(event.event.startDate);
                const endDate = new Date(event.event.endDate);

                const formattedEvent = {
                    ...event.event,
                    startDate: startDate.toISOString().slice(0, 10), // Formato YYYY-MM-DD
                    endDate: endDate.toISOString().slice(0, 10) // Formato YYYY-MM-DD
                };

                // Gestisci la lista delle esclusioni separatamente per ogni occorrenza
                if (formattedEvent.frequency !== 'none') {
                    const repetitions = [];
                    let currentDate = new Date(formattedEvent.startDate);

                    const excludedDates = Array.isArray(formattedEvent.excludedDates)
                        ? formattedEvent.excludedDates.map(date => new Date(date).toISOString().slice(0, 10))
                        : [];  // Imposta un array vuoto se excludedDates è null o undefined

                    while (currentDate <= new Date(formattedEvent.repeatUntil)) {
                        const formattedCurrentDate = currentDate.toISOString().slice(0, 10);

                        // Verifica se la data corrente è in excludedDates
                        if (!excludedDates.includes(formattedCurrentDate)) {
                            // Solo aggiungi la ripetizione se non è esclusa
                            repetitions.push({
                                ...formattedEvent,
                                startDate: formattedCurrentDate,
                                endDate: formattedCurrentDate
                            });
                        }

                        // Aggiorna la data in base alla frequenza
                        if (formattedEvent.frequency === 'daily') {
                            currentDate.setDate(currentDate.getDate() + 1);
                        } else if (formattedEvent.frequency === 'weekly') {
                            currentDate.setDate(currentDate.getDate() + 7);
                        } else if (formattedEvent.frequency === 'monthly') {
                            currentDate.setMonth(currentDate.getMonth() + 1);
                        } else if (formattedEvent.frequency === 'yearly') {
                            currentDate.setFullYear(currentDate.getFullYear() + 1);
                        }
                    }

                    return repetitions; // Aggiungi tutte le ripetizioni
                }

                return [formattedEvent];

            });

            const events = await Promise.all(eventPromises);


            // Unisci tutte le ripetizioni in un unico array
            setEvents(events.flat());
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
        // Controllo se `frequency` è impostato e `repeatUntil` è vuoto
        if (newEvent.frequency !== 'none' && !newEvent.repeatUntil) {
            alert('Seleziona una data di fine per gli eventi con ripetizioni.');
            return; // Interrompi la funzione se la condizione non è soddisfatta
        }

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

    const handleDeleteEvent = async (eventId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:3000/events/delete/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            window.alert("Evento eliminato con successo");
            fetchEvents(); // Ricarica gli eventi
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:3000/tasks/delete/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            window.alert("Attività eliminata con successo");
            fetchTasks(); // Ricarica le attività
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    // Controlla se la data ha eventi o scadenze di attività
    // This function now checks if the date has an event, even if it is in the range between the event start and end dates
    const hasEventsOrTasks = (date) => {
        const dateString = date.toDateString();
        return (
            events.some(event => {
                const startDate = new Date(event.startDate).toDateString();
                const endDate = new Date(event.endDate).toDateString();
                return new Date(startDate) <= new Date(dateString) && new Date(dateString) <= new Date(endDate);
            }) ||
            tasks.some(task => new Date(task.deadline).toDateString() === dateString)
        );
    };

    return (
        <>
            {/* <NavigationBar isAuthenticated={true} /> */}
            <ResponsiveNavbar isAuthenticated={true} />
            <Container fluid>
                <Row className="justify-content-center mt-4">
                    <Col xs={12} md={8} lg={3}>
                        <div className="calendar-container">
                            <Calendar className="calendar"
                                onChange={handleDateClick}
                                value={selectedDate}
                                tileContent={({ date }) => hasEventsOrTasks(date) ? <div className="highlight"></div> : null}
                            />
                        </div>
                    </Col>
                </Row>

                {/* Task List sotto il calendario */}
                <Row className="mt-4">
                    <TaskListComponent tasks={tasks} fetchTasks={fetchTasks} virtualTime={virtualTime} />
                </Row>

                <Row className="mt-4">
                    <EventListPreview events={events} />
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
                    handleDeleteEvent={handleDeleteEvent}  // Passa la funzione di eliminazione evento
                    handleDeleteTask={handleDeleteTask}    // Passa la funzione di eliminazione attività
                />
            </Container>
        </>
    );
};

export default CalendarComponent;
