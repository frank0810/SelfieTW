import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const HomeCard = ({ Category, Title, SectionLink, ImgUrl, CardDescription }) => {

    return (
        <Card style={{ width: '18em' }}>
            <a href={SectionLink} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card.Img variant="top" src={ImgUrl} style={{ width: '60%', height: 'auto' }} />
            </a>
            <Card.Body>
                <Card.Title>{Title}</Card.Title>
                <Card.Text>
                    {CardDescription}
                </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroup.Item>Cras justo odio</ListGroup.Item>
                <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
            </ListGroup>
            <Card.Body>
                <Card.Link href={SectionLink}>Vai a {Category}</Card.Link>

            </Card.Body>
        </Card>
    );
}

export default HomeCard;