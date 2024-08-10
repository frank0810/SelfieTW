import React, { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import NoteModal from './NoteModal';

const SingleNote = ({ id, title, text, category, createdAt, updatedAt }) => {
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => {
        setShowModal(false);
        window.location.reload();
    }

    const handleSave = async (updatedNote) => {
        try {
            const response = await fetch(`http://localhost:3000/notes/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedNote)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            handleClose();
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3000/notes/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            window.location.reload();
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const handleDuplicate = async (duplicateNote) => {
        try {
            const response = await fetch(`http://localhost:3000/notes/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(duplicateNote)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            window.location.reload();
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const truncatedText = text && text.length > 500 ? `${text.substring(0, 500)}...` : text || 'No text available';

    return (
        <>
            <Card className="mb-3" style={{ maxWidth: '80%', margin: 'auto' }}>
                <Card.Header style={{ color: "#0d6efd", fontStyle: "oblique" }}>{category}</Card.Header>
                <Card.Body>
                    <Card.Title>{title}</Card.Title>
                    <Card.Text style={{ height: 'auto' }}>{truncatedText}</Card.Text>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px'
                    }}>
                        <Button variant="primary" onClick={handleShow}>Modifica nota</Button>
                        <Button variant="danger" onClick={handleDelete}>Elimina nota</Button>
                    </div>
                </Card.Body>
                <Card.Footer className="text-muted">
                    Creata il {new Date(createdAt).toLocaleString()}, ultima modifica il {new Date(updatedAt).toLocaleString()}
                </Card.Footer>
            </Card>
            <NoteModal
                show={showModal}
                handleClose={handleClose}
                note={{ id, title, text, category }}
                handleSave={handleSave}
                handleDuplicate={handleDuplicate}
            />
        </>
    );
};

export default SingleNote;