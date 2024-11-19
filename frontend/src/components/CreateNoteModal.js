import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CreateNoteModal = ({ show, handleClose, handleCreate }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [text, setText] = useState('');

    const onCreate = () => {
        if (!title.trim() || !category.trim()) {
            alert('Titolo e Categoria non possono essere vuoti.');
            return;
        }

        handleCreate({
            title,
            category,
            text
        });
        handleClose(); // Chiude il modal dopo la creazione
        window.location.reload(); // Ricarica la pagina
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Crea Nota</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formTitle">
                        <Form.Label>Titolo</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Inserisci titolo (max 50 caratteri)"
                            value={title}
                            maxLength={50} // Limita il numero massimo di caratteri a 50
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formCategory">
                        <Form.Label>Categoria</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Inserisci categoria"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formText">
                        <Form.Label>Testo</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Inserisci testo"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            style={{ height: '200px' }}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Annulla
                </Button>
                <Button variant="success" onClick={onCreate}>
                    Crea Nota
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateNoteModal;