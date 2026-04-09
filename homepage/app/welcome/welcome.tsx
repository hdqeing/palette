import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";
import  Navbar  from "react-bootstrap/Navbar";
import  Container  from "react-bootstrap/Container";
import  iconPalette  from "../assets/iconPalette.svg";
import gridPalette from "../assets/grid-min.png";
import starFilled from "../assets/starFilled.svg"
import Button from "react-bootstrap/Button";
import { Card, Col, Row, Image} from "react-bootstrap";
import mm from '../assets/mm.jpeg'

export function Welcome() {
  return (
    <main className="min-vh-100 d-flex flex-column align-items-center pt-4">
      <Navbar className="bg-light bg-gradient w-75 opacity-90 rounded-5 px-3 mb-5">
          <Col className="d-flex align-items-center">
            <Navbar.Brand href="#home">
              <img src={iconPalette} alt="" width="100" height="100" />
            </Navbar.Brand>
            <h1>Palletly</h1>
          </Col>
          <Col className="d-flex justify-content-end column-gap-3">
            <Button variant="success">Start as Buyer</Button>
            <Button variant="outline-success">Start as Seller</Button>
          </Col>
      </Navbar>

      <Row className="w-75 mb-5">
        <Col>
        <Row>
          <Col>
            <Container className="d-flex gap-2 align-items-center">
              <div className="bg-success bg-gradient p-2 rounded-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 16 16">
                  <path d="M1.4 1.7c.216.289.65.84 1.725 1.274 1.093.44 2.884.774 5.834.528l.37-.023c1.823-.06 3.117.598 3.956 1.579C14.16 6.082 14.5 7.41 14.5 8.5c0 .58-.032 1.285-.229 1.997q.198.248.382.54c.756 1.2 1.19 2.563 1.348 3.966a1 1 0 0 1-1.98.198c-.13-.97-.397-1.913-.868-2.77C12.173 13.386 10.565 14 8 14c-1.854 0-3.32-.544-4.45-1.435-1.125-.887-1.89-2.095-2.391-3.383C.16 6.62.16 3.646.509 1.902L.73.806zm-.05 1.39c-.146 1.609-.008 3.809.74 5.728.457 1.17 1.13 2.213 2.079 2.961.942.744 2.185 1.22 3.83 1.221 2.588 0 3.91-.66 4.609-1.445-1.789-2.46-4.121-1.213-6.342-2.68-.74-.488-1.735-1.323-1.844-2.308-.023-.214.237-.274.38-.112 1.4 1.6 3.573 1.757 5.59 2.045 1.227.215 2.21.526 3.033 1.158.058-.39.075-.782.075-1.158 0-.91-.288-1.988-.975-2.792-.626-.732-1.622-1.281-3.167-1.229l-.316.02c-3.05.253-5.01-.08-6.291-.598a5.3 5.3 0 0 1-1.4-.811"/>
                </svg>
              </div>
              <h4 className="text-white mb-0">Sustainable Suppliers</h4>
            </Container>
            <Container>
              <p>
                Paragraph of text beneath the heading to explain the heading.
                We'll add onto it with another sentence and probably just keep
                going until we run out of words.
              </p>
            </Container>
          </Col>
          <Col>
            <Container className="d-flex gap-2 align-items-center">
              <div className="bg-success bg-gradient p-2 rounded-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" class="bi bi-person-check" viewBox="0 0 16 16">
                  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                  <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                </svg>              
              </div>
              <h4 className="text-white mb-0">Reliable Partner</h4>
            </Container>
            <Container>
              <p>
                Paragraph of text beneath the heading to explain the heading.
                We'll add onto it with another sentence and probably just keep
                going until we run out of words.
              </p>
            </Container>
          </Col>
        </Row>
        <Row>
          <Col>
            <Container className="d-flex gap-2 align-items-center">
              <div className="bg-success bg-gradient  p-2 rounded-2">
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" class="bi bi-cash-coin" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8m5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0"/>
  <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195z"/>
  <path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083q.088-.517.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1z"/>
  <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 6 6 0 0 1 3.13-1.567"/>
</svg>
              </div>
              <h4 className="text-white mb-0">Cost efficient</h4>
            </Container>
            <Container>
              <p>
                Paragraph of text beneath the heading to explain the heading.
                We'll add onto it with another sentence and probably just keep
                going until we run out of words.
              </p>
            </Container>
          </Col>
          <Col>
            <Container className="d-flex gap-2 align-items-center">
              <div className="bg-success bg-gradient p-2 rounded-2">
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" class="bi bi-rulers" viewBox="0 0 16 16">
  <path d="M1 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5v-1H2v-1h4v-1H4v-1h2v-1H2v-1h4V9H4V8h2V7H2V6h4V2h1v4h1V4h1v2h1V2h1v4h1V4h1v2h1V2h1v4h1V1a1 1 0 0 0-1-1z"/>
</svg>              </div>
              <h4 className="text-white mb-0">Customizable Size</h4>
            </Container>
            <Container>
              <p>
                Paragraph of text beneath the heading to explain the heading.
                We'll add onto it with another sentence and probably just keep
                going until we run out of words.
              </p>
            </Container>
          </Col>
        </Row>        
        </Col>
        <Col>
                    <img
              src={gridPalette}
              class="d-block mx-lg-auto img-fluid"
              alt="Bootstrap Themes"
              width="700"
              height="500"
              loading="lazy"
            />

        </Col>
      </Row>

      <Row className="w-75 bg-light bg-gradient rounded-5 mb-5 bg-opacity-75">
        <Col className="bg-lawngreen bg-gradient m-5 opacity-75 p-5 d-flex flex-column align-items-center rounded-5 ">
        <h1 className="text-secondary">247</h1>
        <h5>Customers</h5>
        </Col>
        <Col className="bg-lawngreen bg-gradient m-5 opacity-75 p-5 d-flex flex-column align-items-center rounded-5 ">
        <h1 className="text-secondary">523</h1>
        <h5>Sellers</h5>
        </Col>
        <Col className="bg-lawngreen bg-gradient m-5 opacity-75 p-5 d-flex flex-column align-items-center rounded-5 ">
        <h1 className="text-secondary">682</h1>
        <h5>Orders</h5>
        </Col>
      </Row>

      <Row className="w-75">
        <Col className="border border-light-subtle rounded-5 me-5 pb-4">
          <Row>
                        <Col xxl={4} className="p-3">
              <Image src={mm} roundedCircle></Image>
              
              </Col>
              <Col xxl={8} className="d-flex flex-column align-items-start justify-content-center">
              <h5>Max Mustermann</h5>
              <h6>Zufall Logistiks GmbH</h6>            
              </Col>
          </Row>
          <hr className="my-1"/>
          <Row className="mt-2">
                        <p>
                PalletHub transformed our pallet sourcing process. We've reduced costs by 30% and delivery times by half. The platform's efficiency is unmatched!            
              </p>
          </Row>
          <Row>
          <div className="d-flex">
            <Image src={starFilled}></Image>
            <Image src={starFilled}></Image>
            <Image src={starFilled}></Image>
            <Image src={starFilled}></Image>
            <Image src={starFilled}></Image>
          </div>

          </Row>
        </Col>

        <Col className="border border-5 rounded-5 me-5">
        <Row>
                      <Col xxl={4} className="p-3">
            <Image src={mm} roundedCircle></Image>
            
            </Col>
            <Col xxl={8} className="d-flex flex-column align-items-start justify-content-center">
            <h5>Max Mustermann</h5>
            <h6>Zufall Logistiks GmbH</h6>            
            </Col>
        </Row>
        <Row>
                      <p>
              PalletHub transformed our pallet sourcing process. We've reduced costs by 30% and delivery times by half. The platform's efficiency is unmatched!            
            </p>
        </Row>
        <Row>
        <div className="d-flex">
          <Image src={starFilled}></Image>
          <Image src={starFilled}></Image>
          <Image src={starFilled}></Image>
          <Image src={starFilled}></Image>
          <Image src={starFilled}></Image>
        </div>

        </Row>
        </Col>        
        <Col className="border border-5 rounded-5 me-5">
        <Row>
                      <Col xxl={4} className="p-3">
            <Image src={mm} roundedCircle></Image>
            
            </Col>
            <Col xxl={8} className="d-flex flex-column align-items-start justify-content-center">
            <h5>Max Mustermann</h5>
            <h6>Zufall Logistiks GmbH</h6>            
            </Col>
        </Row>
        <Row>
                      <p>
              PalletHub transformed our pallet sourcing process. We've reduced costs by 30% and delivery times by half. The platform's efficiency is unmatched!            
            </p>
        </Row>
        <Row>
        <div className="d-flex">
          <Image src={starFilled}></Image>
          <Image src={starFilled}></Image>
          <Image src={starFilled}></Image>
          <Image src={starFilled}></Image>
          <Image src={starFilled}></Image>
        </div>

        </Row>
        </Col>
        <Col className="border border-light-subtle rounded-5">
        <Row>
                      <Col xxl={4} className="p-3">
            <Image src={mm} roundedCircle></Image>
            
            </Col>
            <Col xxl={8} className="d-flex flex-column align-items-start justify-content-center">
            <h5>Max Mustermann</h5>
            <h6>Zufall Logistiks GmbH</h6>            
            </Col>
        </Row>
        <Row>
                      <p>
              PalletHub transformed our pallet sourcing process. We've reduced costs by 30% and delivery times by half. The platform's efficiency is unmatched!            
            </p>
        </Row>
        <Row>
        <div className="d-flex">
          <Image src={starFilled}></Image>
          <Image src={starFilled}></Image>
          <Image src={starFilled}></Image>
          <Image src={starFilled}></Image>
          <Image src={starFilled}></Image>
        </div>

        </Row>
        </Col>
              </Row>




          <div class="container">
      <footer class="py-3 my-4">
        <ul class="nav justify-content-center border-bottom pb-3 mb-3">
          <li class="nav-item">
            <a href="#" class="nav-link px-2 text-body-secondary">Impressum</a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link px-2 text-body-secondary">Datenschutz</a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link px-2 text-body-secondary">ADSp</a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link px-2 text-body-secondary">Cookie-Einstellung</a>
          </li>
          <li class="nav-item">
            <a href="#" class="nav-link px-2 text-body-secondary">Sicherheit</a>
          </li>
        </ul>
        <p class="text-center text-body-secondary">&copy; 2025 Palletly, Inc</p>
      </footer>
    </div>


    </main>
  );
}


