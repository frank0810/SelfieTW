import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Calendar from 'react-calendar';
import EventListPreview from './EventListPreview';
import 'react-calendar/dist/Calendar.css';
import CreateEventModal from './CreateEventModal';
import CreateTaskModal from './CreateTaskModal';
import TaskListComponent from './TaskListComponent';
import EventPreviewModal from './EventPreviewModal';
import { useTimeMachine } from '../../TimeMachineContext';
import './CalendarStyles.css';
import ResponsiveNavbar from '../NavBar/ResponsiveNavbar';
import { API_BASE_URL } from './config/api.js';

const CalendarComponent = () => {
    const { virtualTime } = useTimeMachine();
    const [events, setEvents] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showEventModal, setShowEventModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showEventPreviewModal, setShowEventPreviewModal] = useState(false);

    useEffect(() => {
        fetchEvents();
        fetchTasks();
    }, [virtualTime]);

    const fetchEvents = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/user/getUserData`, {
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
                const eventResponse = await fetch(`${API_BASE_URL}/events/${id}`, {
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

                const startDate = new Date(event.event.startDate);
                const endDate = new Date(event.event.endDate);

                const formattedEvent = {
                    ...event.event,
                    startDate: startDate.toISOString().slice(0, 10), 
                    endDate: endDate.toISOString().slice(0, 10) 
                };

                if (formattedEvent.frequency !== 'none') {
                    const repetitions = [];
                    let currentDate = new Date(formattedEvent.startDate);

                    const excludedDates = Array.isArray(formattedEvent.excludedDates)
                        ? formattedEvent.excludedDates.map(date => new Date(date).toISOString().slice(0, 10))
                        : [];  

                    while (currentDate <= new Date(formattedEvent.repeatUntil)) {
                        const formattedCurrentDate = currentDate.toISOString().slice(0, 10);

                        
                        if (!excludedDates.includes(formattedCurrentDate)) {  
                            repetitions.push({
                                ...formattedEvent,
                                startDate: formattedCurrentDate,
                                endDate: formattedCurrentDate
                            });
                        }

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

                    return repetitions; 
                }

                return [formattedEvent];

            });

            const events = await Promise.all(eventPromises);

            setEvents(events.flat());
        } catch (error) {
            console.error('There was a BAD problem with the fetch operation:', error);
        }
    };


    const fetchTasks = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/user/getUserData`, {
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
                const taskResponse = await fetch(`${API_BASE_URL}/tasks/${id}`, {
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

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setShowEventPreviewModal(true);
    };

    const openEventModal = () => {
        setShowEventPreviewModal(false);  
        setShowEventModal(true);          
    };

    const openTaskModal = () => {
        setShowEventPreviewModal(false);  
        setShowTaskModal(true);           
    };

    
    const handleCreateEvent = async (newEvent) => {
        
        if (newEvent.frequency !== 'none' && !newEvent.repeatUntil) {
            alert('Seleziona una data di fine per gli eventi con ripetizioni.');
            return; 
        }

        try {
            const response = await fetch(`${API_BASE_URL}/events/create`, {
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

    const handleCreateTask = async (newTask) => {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/create`, {
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
            const response = await fetch(`${API_BASE_URL}/events/delete/${eventId}`, {
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
            fetchEvents();
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/delete/${taskId}`, {
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
            fetchTasks(); 
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

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

                <Row className="mt-4">
                    <TaskListComponent tasks={tasks} fetchTasks={fetchTasks} virtualTime={virtualTime} />
                </Row>

                <Row className="mt-4">
                    <EventListPreview events={events} />
                </Row>


                <CreateEventModal
                    show={showEventModal}
                    handleClose={() => setShowEventModal(false)}
                    handleCreate={handleCreateEvent}
                    defaultStartDate={selectedDate} 
                />
                <CreateTaskModal
                    show={showTaskModal}
                    handleClose={() => setShowTaskModal(false)}
                    handleCreate={handleCreateTask}
                    defaultDeadline={selectedDate}  
                />
                <EventPreviewModal
                    selectedDate={selectedDate}
                    show={showEventPreviewModal}
                    handleClose={() => setShowEventPreviewModal(false)}
                    events={events}
                    tasks={tasks}
                    openEventModal={openEventModal} 
                    openTaskModal={openTaskModal}   
                    handleDeleteEvent={handleDeleteEvent} 
                    handleDeleteTask={handleDeleteTask}    
                />
            </Container>
        </>
    );
};

export default CalendarComponent;
