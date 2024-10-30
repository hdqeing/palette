import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import PaletteIcon from './assets/iconPalette.svg';
import SearchIcon from './assets/search.svg';
import EgPaletten from './assets/egPalette.jpg';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import './index.css'
import Card from 'react-bootstrap/Card';
import PaletteCard from './components/PaletteCard';


export default function App(props) {
  const paletteList = props.paletten?.map((palette) => (
    <Col>
      <PaletteCard name={palette.name}/>
    </Col>
  ))
  return (
    <>
        <Container fluid className="navbar-background m-0 p-0 d-flex flex-column justify-content-between">
<Navbar className=" d-flex align-items-start pt-3">
  <Col className='d-flex justify-content-end '>
        <Image src={PaletteIcon} alt="logo" height="75" />
      </Col>
      <Col />
      <Col >
        <InputGroup>
          <Form.Control placeholder='Search for products'>
          </Form.Control>
          <Button variant="success">
            <Image src={SearchIcon}></Image>
          </Button>
        </InputGroup>
      </Col>
      <Col className='d-flex justify-content-center'>
        <Button variant="success">Login</Button>
      </Col>

</Navbar>
<div className='d-flex justify-content-center mb-5'>
<h1 className='text-light'>Paletten Bestellen nach Ihre Wünsche.</h1>

</div>
    </Container>
        <Row xs={1} md={2} className="g-4">
          {paletteList}
      </Row>
      <Container className='bg-wood m-0 p-0 mw-100 footer' >
        <Row>
          <Col >
          <h2>myPalette</h2>
          <p>Paletten bestellen von besten Lieferanden aus Europa.</p>
          </Col>
          <Col>
          <h2>Kontakt</h2>
          <p>Holzminden Palettenhandel GmbH</p>
          <p>Lang Strasse 20</p>
          <p>37152 Holzminden</p>
          <p>info@palettenhandel.de</p>
          <p>01234567</p>
          </Col>
          <Col>
          <h2>Impressium</h2>
          <h2>FAQ</h2>
          <h2>Datenschutz</h2>

          </Col>
        </Row>
      </Container>
    </>




    





  );
  }