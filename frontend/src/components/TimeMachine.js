import React, { useState, useEffect } from 'react';
import { useTimeMachine } from '../TimeMachineContext';
import { Button, Form, Modal } from 'react-bootstrap';
import './TimeMachine.css';

const TimeMachine = () => {
    const { virtualTime, travelInTime, resetToRealTime } = useTimeMachine();
    const [show, setShow] = useState(false);
    const [newDate, setNewDate] = useState(virtualTime.toISOString().substring(0, 16));
    const [isMinimized, setIsMinimized] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleDateChange = (e) => setNewDate(e.target.value);
    const handleTravel = () => {
        travelInTime(new Date(newDate));
        handleClose();
    };

    // Sto in mobile mode?!
    useEffect(() => {
        if (window.innerWidth < 768) {
            setIsMinimized(true);
        }
    }, []);

    const toggleMinimize = () => setIsMinimized(prev => !prev);

    return (
        <div className="time-machine-container">
            <button className="tm-toggle-button" onClick={toggleMinimize}>TM</button>

            {!isMinimized && (
                <>
                    <Button variant="primary" onClick={handleShow}>
                        Time Machine
                    </Button>

                    <Modal show={show} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Viaggia nel Tempo!</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formNewDate">
                                    <Form.Label>Seleziona una nuova data e ora</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={newDate}
                                        onChange={handleDateChange}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Annulla
                            </Button>
                            <Button variant="success" onClick={handleTravel}>
                                Viaggia nel Tempo
                            </Button>
                            <Button variant="warning" onClick={resetToRealTime}>
                                Reset Tempo Reale
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <div className="current-time-display">
                        <p>Data e ora attuali: {virtualTime.toLocaleString()}</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default TimeMachine;
