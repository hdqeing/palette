import Footer from "../components/Footer";
import "./Layout.css"; // Import CSS
import { Outlet } from "react-router-dom";
import { Col, Container, Nav, Row, Navbar, NavLink, Image, Button, Dropdown, NavDropdown } from "react-bootstrap";
import DashboardIcon from "../assets/dashboard.svg" 
import NotificationIcon from "../assets/notifications.svg" 
import NegotiateIcon from '../assets/negotiate.svg'
import OrderIcon from '../assets/order.svg'
import StatsIcon from '../assets/statistics.svg'
import MailIcon from '../assets/mail.svg'
import ProfileIcon from '../assets/profile.svg'
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

export default function SellerLayout({ children }) {
  const { t, i18n } = useTranslation();
  return (
    <Container fluid>
    <Row className="min-vh-100">
      <Col xs={2} className="rounded shadow p-4">
      <Container className="text-center shadow-sm p-3">
        <h3>Holzpalette</h3>
      </Container>
      <Nav className="flex-column">
        <Nav.Item className="d-flex">
          <Image src={DashboardIcon} alt='dashboard icon' />
          <Nav.Link>{t('dashboard')}</Nav.Link>
        </Nav.Item>
        <Nav.Item className="d-flex">
          <Image src={NegotiateIcon} alt='dashboard icon' />
          <Nav.Link href="/seller/query">{t('inquiry')}</Nav.Link>
        </Nav.Item>
        <Nav.Item className="d-flex">
          <Image src={OrderIcon} alt='dashboard icon' />
          <Nav.Link>{t('order')}</Nav.Link>
        </Nav.Item>
        <Nav.Item className="d-flex">
          <Image src={StatsIcon} alt='dashboard icon' />
          <Nav.Link href="/seller/stats">{t('statistics')}</Nav.Link>
        </Nav.Item>   
        <Nav.Item className="d-flex">
          <Image src={MailIcon} alt='dashboard icon' />
          <Nav.Link>{t('mail')}</Nav.Link>
        </Nav.Item>
        <Nav.Item className="d-flex">
          <Image src={ProfileIcon} alt='dashboard icon' />
          <Nav.Link href="/seller/profile">{t('profile')}</Nav.Link>
        </Nav.Item>    
      </Nav>
      </Col>
      <Col>
      <Row>
      <Navbar>
          <Nav className="ms-auto gap-3">
            <NavDropdown title="Language">
              <NavDropdown.Item onClick={() => i18n.changeLanguage("de")}>
                <ReactCountryFlag countryCode="DE" svg /> Deutsch
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => i18n.changeLanguage("en")}>
                <ReactCountryFlag countryCode="GB" svg /> English
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => i18n.changeLanguage("ru")}>
                <ReactCountryFlag countryCode="RU" svg /> Русский
              </NavDropdown.Item>
            </NavDropdown>
            <Image src={NotificationIcon} />
            <Button variant="outline-success">Register</Button>
            <Button variant="success">Login</Button>
          </Nav>
      </Navbar>
      </Row>
      <Row>

      <Outlet />
      </Row>
      </Col>
    </Row>
    </Container>



  );
}
