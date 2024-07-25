import React, { useState, useEffect } from 'react';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
} from 'mdb-react-ui-kit';
import NavigationBar from './Navbar';
import { Row, Col, Image, Modal, Button } from 'react-bootstrap';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
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
        setUserData(result.user);
        console.log('User details:', result.user);
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
      const response = await fetch('http://localhost:3000/user/updateProfilePic', {
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

      const result = await response.json();
      alert('Immagine del profilo aggiornata con successo!');
      setUserData({ ...userData, profilePic: imagePath });
      setShowModal(false); // Chiudi la finestra modale dopo aver selezionato un'immagine
    } catch (error) {
      console.error('Errore durante l\'aggiornamento dell\'immagine del profilo:', error);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Se il caricamento è in corso, mostra un indicatore di caricamento
  if (loading) {
    return <div>Caricamento...</div>;
  }

  const profilePicUrl = userData?.profilePic ? `http://localhost:3000${userData.profilePic}` : '/default-profile-pic.jpg';
  const birthday = userData?.birthday
    ? new Date(userData.birthday).toLocaleDateString('it-IT')
    : 'Non specificato';

  const username = userData?.username || 'Non specificato';

  return (
    <section>
      <NavigationBar isAuthenticated={true} />
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
                    style={{ marginTop:'1%' }} // Imposta una larghezza e altezza fissa
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
                    <MDBCardText>Nome</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{userData?.firstName + ' ' + userData?.lastName}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{userData?.email}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Username</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{username}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Data di Nascita</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{birthday}</MDBCardText>
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
                src="http://localhost:3000/images/profile-pic.jpg"
                thumbnail
                rounded
                style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                onClick={() => handleImageClick('/images/profile-pic.jpg')}
              />
            </Col>
            <Col xs={6} md={4} className="d-flex justify-content-center mb-2">
              <Image
                src="http://localhost:3000/images/profile-pic2.jpg"
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
                src="http://localhost:3000/images/profile-pic3.jpg"
                thumbnail
                rounded
                style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                onClick={() => handleImageClick('/images/profile-pic3.jpg')}
              />
            </Col>
            <Col xs={6} md={4} className="d-flex justify-content-center mb-2">
              <Image
                src="http://localhost:3000/images/profile-pic4.jpg"
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
                src="http://localhost:3000/images/profile-pic5.jpg"
                thumbnail
                rounded
                style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                onClick={() => handleImageClick('/images/profile-pic5.jpg')}
              />
            </Col>
            <Col xs={6} md={4} className="d-flex justify-content-center mb-2">
              <Image
                src="http://localhost:3000/images/profile-pic6.jpg"
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
    </section>
  );
};

export default ProfilePage;