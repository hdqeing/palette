import EgPaletten from '../assets/egPalette.jpg';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../index.css'
import Card from 'react-bootstrap/Card';

function PaletteCard(props) {
    return (
        <Card className='card-horizontal shadow'>
        <Card.Img variant="top" src={EgPaletten} className='w-50 p-3'/>
        <Card.Body>
          <Card.Title>{props.name}</Card.Title>
          <Form>
            <Form.Group>
              <Form.Label>Size</Form.Label>
              <Form.Select>
                <option>1200*800*144</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Material</Form.Label>
              <Form.Select>
                <option>1200*800*144</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Zustand</Form.Label>
              <Form.Select>
                <option>Neu</option>
                <option>Gebraucht</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Menge</Form.Label>
              <Form.Control>
              </Form.Control>
            </Form.Group>
            <Button className='mt-3'>
              Add to Shopping cart
            </Button>

          </Form>
        </Card.Body>
      </Card>
    )

}

export default PaletteCard;