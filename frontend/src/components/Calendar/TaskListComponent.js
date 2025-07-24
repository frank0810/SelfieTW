// import React, {useEffect} from 'react';
// import { ListGroup, Row, Col } from 'react-bootstrap';
// import SingleTaskComponent from './SingleTaskComponent';
// import { useTimeMachine } from '../../TimeMachineContext';

// const TaskListComponent = ({ tasks, fetchTasks }) => {
//   const { virtualTime } = useTimeMachine();
//   useEffect(() => {
// }, [virtualTime]);
//   return (
//     <div className="text-center">
//       <h2 className="mb-4">Attività</h2>
//       <ListGroup className="w-75 mx-auto">
//         <ListGroup.Item className="text-center bg-primary text-white">
//           <Row>
//             <Col>Titolo</Col>
//             <Col>Data di Scadenza</Col>
//             <Col>Stato</Col>
//             <Col></Col>
//             <Col></Col>
//           </Row>
//         </ListGroup.Item>
//         {tasks.map((task) => (
//           <SingleTaskComponent key={task._id} task={task} fetchTasks={fetchTasks} virtualTime={virtualTime} />
//         ))}
//       </ListGroup>
//     </div>
//   );
// };

// export default TaskListComponent;

import React, { useEffect, useState } from 'react';
import { ListGroup, Row, Col, Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import SingleTaskComponent from './SingleTaskComponent';
import { useTimeMachine } from '../../TimeMachineContext';
import { API_BASE_URL } from '../../config/api.js';

const TaskListComponent = ({ tasks, fetchTasks }) => {
  const { virtualTime } = useTimeMachine();
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editedTask, setEditedTask] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
  }, [virtualTime]);

  // Funzione per abbreviare il titolo
  const abbreviateTitle = (title, maxLength = 15) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  // Funzione per ottenere il colore del pallino basato sullo stato
  const getStatusColor = (task) => {
    if (task.isCompleted) return 'green';
    
    const today = new Date(virtualTime);
    const deadline = new Date(task.deadline);
    
    if (deadline < today) return 'red'; // In ritardo
    return 'yellow'; // In corso
  };

  // Funzione per aprire il modale di modifica
  const handleEditTask = (task) => {
    setSelectedTask(task);
    setEditedTask({ ...task });
    setShowModal(true);
    setError('');
  };

  // Funzione per chiudere il modale
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedTask(null);
    setEditedTask({});
    setError('');
  };

  // Validazione del form
  const validateTask = () => {
    if (!editedTask.title?.trim()) {
      setError('Il titolo è obbligatorio');
      return false;
    }
    if (!editedTask.deadline) {
      setError('La scadenza è obbligatoria');
      return false;
    }
    setError('');
    return true;
  };

  // Salva le modifiche
  const handleSaveTask = async () => {
    if (!validateTask()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/update/${selectedTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(editedTask),
      });

      if (response.ok) {
        handleModalClose();
        fetchTasks(); // Ricarica la lista
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Errore del server');
      }
    } catch (error) {
      console.error('Errore nella modifica dell\'attività:', error);
      setError('Errore nella modifica dell\'attività. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h2 className="mb-4">Attività</h2>
      <ListGroup className="w-75 mx-auto">
        {/* Header per desktop */}
        <ListGroup.Item className="d-none d-md-block text-center bg-primary text-white">
          <Row>
            <Col>Titolo</Col>
            <Col>Data di Scadenza</Col>
            <Col>Stato</Col>
            <Col></Col>
            <Col></Col>
          </Row>
        </ListGroup.Item>
        
        {/* Header per mobile */}
        <ListGroup.Item className="d-block d-md-none text-center bg-primary text-white">
          <Row>
            <Col>Titolo</Col>
            <Col>Scadenza</Col>
            <Col>Stato</Col>
            <Col></Col>
          </Row>
        </ListGroup.Item>

        {tasks.map((task) => (
          <ListGroup.Item key={task._id}>
            {/* Vista desktop */}
            <div className="d-none d-md-block">
              <SingleTaskComponent task={task} fetchTasks={fetchTasks} virtualTime={virtualTime} />
            </div>
            
            {/* Vista mobile */}
            <div className="d-block d-md-none">
              <Row className="align-items-center">
                <Col>
                  <strong>{abbreviateTitle(task.title)}</strong>
                </Col>
                <Col>
                  <small>{new Date(task.deadline).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })}</small>
                </Col>
                <Col className="text-center">
                  <span 
                    style={{
                      display: 'inline-block',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(task)
                    }}
                  ></span>
                </Col>
                <Col className="text-center">
                  <span 
                    style={{ cursor: 'pointer', fontSize: '14px' }}
                    onClick={() => handleEditTask(task)}
                  >
                    ✏️
                  </span>
                </Col>
              </Row>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Modal di modifica per mobile */}
      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>✏️ Modifica Attività</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          
          <Form>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Titolo *</Form.Label>
              <Form.Control
                type="text"
                value={editedTask.title || ''}
                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                isInvalid={!!error && !editedTask.title?.trim()}
                placeholder="Inserisci il titolo dell'attività"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>📝 Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Inserisci una descrizione (opzionale)"
                value={editedTask.description || ''}
                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDeadline">
              <Form.Label>Scadenza *</Form.Label>
              <Form.Control
                type="date"
                value={editedTask.deadline?.slice(0, 10) || ''}
                onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })}
                isInvalid={!!error && !editedTask.deadline}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formIsCompleted">
              <Form.Switch
                label="✅ Attività completata"
                checked={editedTask.isCompleted || false}
                onChange={(e) => setEditedTask({ ...editedTask, isCompleted: e.target.checked })}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-between">
              <Button 
                variant="primary" 
                onClick={handleSaveTask} 
                disabled={loading}
              >
                {loading ? <Spinner size="sm" className="me-2" /> : '💾 '}
                Salva Modifiche
              </Button>
              
              <Button 
                variant="outline-secondary" 
                onClick={handleModalClose}
                disabled={loading}
              >
                ❌ Annulla
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TaskListComponent;