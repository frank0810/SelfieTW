import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const SingleNote = ({ title, text, category, createdAt, updatedAt }) => {
    const truncatedText = text && text.length > 250 ? `${text.substring(0, 250)}...` : text || 'No text available';

    return (
        <Card className="mb-3">
            <Card.Header>{category}</Card.Header>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>{truncatedText}</Card.Text>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px'
                }}>
                    <Button variant="primary">Modifica nota</Button>
                    <Button variant="danger">Elimina nota</Button>
                </div>
            </Card.Body>
            <Card.Footer className="text-muted">
                Creata il {new Date(createdAt).toLocaleString()}, ultima modifica il {new Date(updatedAt).toLocaleString()}
            </Card.Footer>
        </Card>
    );
};

export default SingleNote;