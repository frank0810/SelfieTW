import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const NoteModal = ({ show, handleClose, note, handleSave }) => {
    const [title, setTitle] = useState(note.title);
    const [category, setCategory] = useState(note.category);
    const [text, setText] = useState(note.text);

    const onSave = () => {
        handleSave({
            ...note,
            title,
            category,
            text
        });
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Modifica Nota</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formTitle">
                        <Form.Label style ={{fontWeight: "bold"}}>Titolo</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Inserisci titolo"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formCategory">
                        <Form.Label style ={{fontWeight: "bold"}} >Categoria</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Inserisci categoria"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formText">
                        <Form.Label style ={{fontWeight: "bold"}}>Testo</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={20}
                            placeholder="Inserisci testo"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Annulla modifiche
                </Button>
                <Button variant="primary" onClick={onSave}>
                    Salva modifiche
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NoteModal;