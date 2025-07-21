import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

const CreateTaskModal = ({ show, handleClose, handleCreate, defaultDeadline }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(new Date(defaultDeadline).toLocaleDateString('en-CA'));
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setDeadline(new Date(defaultDeadline).toLocaleDateString('en-CA'));
  }, [defaultDeadline]);

  const validateForm = () => {
    if (!title.trim()) {
      setError('Il titolo è obbligatorio');
      return false;
    }
    if (!deadline) {
      setError('La data di scadenza è obbligatoria');
      return false;
    }
    setError('');
    return true;
  };

  const onCreate = () => {
    if (!validateForm()) return;

    setLoading(true);
    handleCreate({
      title,
      description,
      deadline,
      isCompleted
    });
    setLoading(false);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>➕ Crea Nuova Attività</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
        
        <Form>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Titolo *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci il titolo dell'attività"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isInvalid={!!error && !title.trim()}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Inserisci una descrizione (opzionale)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDeadline">
            <Form.Label>Scadenza *</Form.Label>
            <Form.Control
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              isInvalid={!!error && !deadline}
            />
          </Form.Group>

          <Form.Group controlId="formIsCompleted" className="mb-4">
            <Form.Switch
              label="✅ Attività completata"
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button 
              variant="primary" 
              onClick={onCreate}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" className="me-2" /> : '💾 '}
              Crea Attività
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateTaskModal;