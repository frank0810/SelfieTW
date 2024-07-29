import React, { useEffect, useState } from 'react';
import SingleNote from './SingleNote';
import { Container, Row, Col, Button } from 'react-bootstrap';
import NavigationBar from './Navbar';
import CreateNoteModal from './CreateNoteModal';

const Note = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        const fetchUserNotes = async () => {
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
                const noteIds = result.user.userNotes || [];

                const notePromises = noteIds.map(async (id) => {
                    const noteResponse = await fetch(`http://localhost:3000/notes/${id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!noteResponse.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const note = await noteResponse.json();

                    return note.note;
                });

                const notes = await Promise.all(notePromises);
                setNotes(notes);
            } catch (error) {
                console.error('There was a BAD problem with the fetch operation:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserNotes();
    }, []);

    const handleCreate = async (newNote) => {
        try {
            const response = await fetch('http://localhost:3000/notes/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newNote)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setShowCreateModal(false);

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    if (loading) {
        return <div>Caricamento...</div>;
    }

    return (
        <>
            <NavigationBar isAuthenticated={true} />
            <Container>
                <div className='row'>
                <h1 className="text-center">Note</h1>
                <div className="text-center mb-4">
                    <Button variant="success" onClick={() => setShowCreateModal(true)} style={{marginTop:"1.5em"}}>+ Nuova Nota</Button>
                </div>
                </div>
                <Row className="justify-content-center">
                    {notes.length === 0 ? (
                        <p>Nessuna nota disponibile.</p>
                    ) : (
                        notes.map(note => (
                            <Col xs={12} key={note._id} className="mb-3">
                                <SingleNote
                                    id={note._id}
                                    title={note.title}
                                    text={note.text}
                                    category={note.category}
                                    createdAt={note.createdAt}
                                    updatedAt={note.updatedAt}
                                />
                            </Col>
                        ))
                    )}
                </Row>
            </Container>
            <CreateNoteModal
                show={showCreateModal}
                handleClose={() => setShowCreateModal(false)}
                handleCreate={handleCreate}
            />
        </>
    );
};

export default Note;