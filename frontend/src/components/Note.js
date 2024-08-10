import React, { useEffect, useState } from 'react';
import SingleNote from './SingleNote';
import { Container, Row, Col, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import NavigationBar from './Navbar';
import CreateNoteModal from './CreateNoteModal';

const Note = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [sortOption, setSortOption] = useState('title'); // State to track the current sorting option

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

    // Sorting functions
    const sortNotes = (notes, option) => {
        switch (option) {
            case 'title':
                return notes.sort((a, b) => a.title.localeCompare(b.title));
            case 'date':
                return notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'length':
                return notes.sort((a, b) => b.text.length - a.text.length);
            case 'category':
                return notes.sort((a, b) => a.category.localeCompare(b.category));
            default:
                return notes;
        }
    };

    const handleSortChange = (option) => {
        setSortOption(option);
    };

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
            window.location.reload(); // Refresh notes after creation

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    if (loading) {
        return <div>Caricamento...</div>;
    }

    const sortedNotes = sortNotes([...notes], sortOption);

    return (
        <>
            <NavigationBar isAuthenticated={true} />
            <Container>
                <div className='row'>
                    <h1 className="text-center">Note</h1>
                    <div className="text-center mb-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <DropdownButton
                            id="dropdown-basic-button"
                            title="Ordina Per"
                            onSelect={handleSortChange}
                            className="me-2"
                            style={{ marginTop: '1.5em'}}
                        >
                            <Dropdown.Item eventKey="title">Titolo</Dropdown.Item>
                            <Dropdown.Item eventKey="date">Data</Dropdown.Item>
                            <Dropdown.Item eventKey="length">Lunghezza</Dropdown.Item>
                            <Dropdown.Item eventKey="category">Categoria</Dropdown.Item>
                        </DropdownButton>
                        <Button variant="success" onClick={() => setShowCreateModal(true)} style={{ marginTop: "1.5em" }}>
                            + Nuova Nota
                        </Button>
                    </div>
                </div>
                <Row className="justify-content-center">
                    {sortedNotes.length === 0 ? (
                        <p>Nessuna nota disponibile.</p>
                    ) : (
                        sortedNotes.map(note => (
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