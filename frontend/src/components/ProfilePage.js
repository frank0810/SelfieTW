import { useState, useEffect } from 'react';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
} from 'mdb-react-ui-kit';
import { Row, Col, Image, Modal, Button, Form } from 'react-bootstrap';
import ResponsiveNavbar from './NavBar/ResponsiveNavbar';
import { API_BASE_URL } from '../config/api.js';
const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showBirthdayModal, setShowBirthdayModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newBirthday, setNewBirthday] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${API_BASE_URL}/user/getUserData`, {
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
        setUserData(result.user);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageClick = async (imagePath) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/user/updateProfilePic`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ proPic: imagePath })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok :(');
      }

      alert('Immagine del profilo aggiornata con successo!');
      setUserData({ ...userData, profilePic: imagePath });
      setShowModal(false); 
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dell\'immagine del profilo:', error);
    }
  };

  const handleUsernameChange = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/user/updateUsername`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: newUsername })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok :(');
      }

      alert('Username aggiornato con successo!');
      setUserData({ ...userData, username: newUsername });
      setShowUsernameModal(false); 
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dell\'username:', error);
    }
  };

  const handleBirthdayChange = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}/user/updateBirthday`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ birthday: newBirthday })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok :(');
      }

      alert('Data di nascita aggiornata con successo!');
      setUserData({ ...userData, birthday: newBirthday });
      setShowBirthdayModal(false); 
    } catch (error) {
      console.error('Errore durante l\'aggiornamento della data di nascita:', error);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowUsernameModal = () => setShowUsernameModal(true);
  const handleCloseUsernameModal = () => setShowUsernameModal(false);

  const handleShowBirthdayModal = () => setShowBirthdayModal(true);
  const handleCloseBirthdayModal = () => setShowBirthdayModal(false);

  if (loading) {
    return <div>Caricamento...</div>;
  }

  const profilePicUrl = userData?.profilePic ? `${API_BASE_URL}${userData.profilePic}` : '/default-profile-pic.jpg';
  const birthday = userData?.birthday
    ? new Date(userData.birthday).toLocaleDateString('it-IT')
    : 'Non specificato';

  const username = userData?.username || 'Non specificato';

  return (
    <section>
      <ResponsiveNavbar isAuthenticated={true} />
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol lg="12">
            <MDBCard className="mb-4" style={{ backgroundColor: '#F8F9FA' }}>
              <MDBCardBody className="text-center">
                <MDBCardImage
                  id="profile-picture"
                  src={profilePicUrl}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: '150px' }}
                  fluid
                />
                <div className="d-flex justify-content-center mb-2">
                  <Button
                    onClick={handleShowModal}
                    style={{ marginTop: '1%' }} 
                    variant="primary"
                  >
                    Cambia Immagine
                  </Button>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="12">
            <MDBCard className="mb-4" style={{ backgroundColor: '#F8F9FA' }}>
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText style={{ height:'2em', display: 'block '}}>Nome</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted" style={{ height:'2em', display: 'block '}}>{userData?.firstName + ' ' + userData?.lastName}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText style={{ height:'2em', display: 'block '}}>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted" style={{ height:'2em', display: 'block '}}>{userData?.email}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText style={{ height:'2em', display: 'block '}}>Username</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted" style={{ height:'2em', display: 'block '}}>{username}</MDBCardText>
                    <Button variant="link" onClick={handleShowUsernameModal} style={{margin: 0, padding: 0, fontSize: '0.85em'}}>
                      Modifica Username
                    </Button>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText style={{ height:'2em', display: 'block '}}>Data di Nascita</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted" style={{ height:'2em', display: 'block '}}>{birthday}</MDBCardText>
                    <Button variant="link" onClick={handleShowBirthdayModal} style={{margin: 0, padding: 0, fontSize: '0.85em'}}>
                      Modifica Data di Nascita
                    </Button>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Seleziona Immagine del Profilo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="justify-content-center">
            <Col xs={6} md={4} className="d-flex justify-content-center mb-2">
              <Image
                src={`${API_BASE_URL}/images/profile-pic.jpg`}
                thumbnail
                rounded
                style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                onClick={() => handleImageClick('/images/profile-pic.jpg')}
              />
            </Col>
            <Col xs={6} md={4} className="d-flex justify-content-center mb-2">
              <Image
                src={`${API_BASE_URL}/images/profile-pic2.jpg`}
                thumbnail
                rounded
                style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                onClick={() => handleImageClick('/images/profile-pic2.jpg')}
              />
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs={6} md={4} className="d-flex justify-content-center mb-2">
              <Image
                src={`${API_BASE_URL}/images/profile-pic3.jpg`}
                thumbnail
                rounded
                style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                onClick={() => handleImageClick('/images/profile-pic3.jpg')}
              />
            </Col>
            <Col xs={6} md={4} className="d-flex justify-content-center mb-2">
              <Image
                src={`${API_BASE_URL}/images/profile-pic4.jpg`}
                thumbnail
                rounded
                style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                onClick={() => handleImageClick('/images/profile-pic4.jpg')}
              />
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs={6} md={4} className="d-flex justify-content-center mb-2">
              <Image
                src={`${API_BASE_URL}/images/profile-pic5.jpg`}
                thumbnail
                rounded
                style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                onClick={() => handleImageClick('/images/profile-pic5.jpg')}
              />
            </Col>
            <Col xs={6} md={4} className="d-flex justify-content-center mb-2">
              <Image
                src={`${API_BASE_URL}/images/profile-pic6.jpg`}
                thumbnail
                rounded
                style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                onClick={() => handleImageClick('/images/profile-pic6.jpg')}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUsernameModal} onHide={handleCloseUsernameModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Username</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewUsername">
              <Form.Label>Nuovo Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Il tuo nuovo username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUsernameModal}>
            Chiudi
          </Button>
          <Button variant="primary" onClick={handleUsernameChange}>
            Salva
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showBirthdayModal} onHide={handleCloseBirthdayModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Data di Nascita</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewBirthday">
              <Form.Control
                type="date"
                placeholder="Inserisci la nuova data di nascita"
                value={newBirthday}
                onChange={(e) => setNewBirthday(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseBirthdayModal}>
            Chiudi
          </Button>
          <Button variant="primary" onClick={handleBirthdayChange}>
            Salva
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default ProfilePage;