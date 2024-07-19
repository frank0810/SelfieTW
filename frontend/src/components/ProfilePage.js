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

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
                  fluid />
                <div className="d-flex justify-content-center mb-2">
                  <MDBBtn >Carica Immagine</MDBBtn>
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
    </section>
  );
};

export default ProfilePage;