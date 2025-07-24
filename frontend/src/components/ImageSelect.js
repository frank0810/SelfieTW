import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import { API_BASE_URL } from '../config/api.js'; 

function ImageSelect() {
    return (
        <div
            className="modal show"
            style={{ display: 'block', position: 'initial' }}
        >
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>Seleziona un immagine</Modal.Title>
                </Modal.Header>

                <Container>
                    <Row>
                        <Col xs={6} md={4}>
                            <Image src={`${API_BASE_URL}/images/profile-pic.jpg`} rounded />
                        </Col>
                        <Col xs={6} md={4}>
                            <Image src="holder.js/171x180" roundedCircle />
                        </Col>
                        <Col xs={6} md={4}>
                            <Image src="holder.js/171x180" thumbnail />
                        </Col>
                    </Row>
                </Container>

                <Modal.Footer>
                    <Button variant="secondary">Close</Button>
                    <Button variant="primary">Save changes</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    );
}

export default ImageSelect;