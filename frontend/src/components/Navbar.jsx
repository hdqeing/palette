import { Container, Navbar, Col, Image, Form, InputGroup, Button } from "react-bootstrap"
import { Link } from "react-router-dom"

export default function Narbar() {
    return (
        <Container fluid className="navbar-background m-0 p-0 d-flex flex-column justify-content-between">
        <Navbar className=" d-flex align-items-start pt-3">
          <Col className='d-flex justify-content-end '>
                {/* <Image src={PaletteIcon} alt="logo" height="75" /> */}
              </Col>
              <Col />
              <Col >
                <InputGroup>
                  <Form.Control placeholder='Search for products'>
                  </Form.Control>
                  <Button variant="success">
                    {/* <Image src={SearchIcon}></Image> */}
                  </Button>
                </InputGroup>
              </Col>
              <Col className='d-flex justify-content-center'>
                <Button variant="success">
                  <Link to="login">Login</Link>
                </Button>
              </Col>
        
        </Navbar>
        <div className='d-flex justify-content-center mb-5'>
        <h1 className='text-light'>Paletten Bestellen nach Ihre Wünsche.</h1>
        
        </div>
            </Container>
    )
}