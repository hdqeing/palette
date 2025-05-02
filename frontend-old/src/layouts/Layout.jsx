import { Button, Dropdown, Nav } from "react-bootstrap";
import { Navbar, Container, Image, Col} from "react-bootstrap";
import Footer from "../components/Footer";
import "./Layout.css"; // Import CSS
import PaletteIcon from "../assets/iconPalette.svg";
import NotificationIcon from "../assets/notifications.svg";
import ProfileIcon from "../assets/profile.svg";
import CartIcon from "../assets/cart.svg";
import React from "react";
import { OverlayTrigger, Popover } from 'react-bootstrap';

export default function Layout({ children }) {

  const IconToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a 
    href="" 
    ref={ref} 
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}>
      {children}
    </a>
  ));
  return (
    <div>
      <header style={{backgroundColor: "bisque", height: "10vh"}}>
        <Navbar style={{width: "75%", margin: "0 auto"}}>
          <Col>
            <Navbar.Brand href="#home">
              <Image src={PaletteIcon} style={{height: "100px"}}></Image>
            </Navbar.Brand> 
          </Col>
          <Col className="d-flex justify-content-end gap-3">
          <OverlayTrigger
  trigger="click"
  placement="bottom"
  rootClose
  overlay={
    <Popover id="notification-popover" className="notification-popover">
      <Popover.Body>
        <Button>
          Login
        </Button>
      </Popover.Body>
    </Popover>
  }
>
  <Image 
    roundedCircle
    src={NotificationIcon}
    style={{height: "35px", padding: "5px", backgroundColor: "orange"}}
    className="cursor-pointer"
  />
</OverlayTrigger>

<OverlayTrigger
  trigger="click"
  placement="bottom"
  rootClose
  overlay={
    <Popover id="notification-popover" className="notification-popover">
      <Popover.Body>
        <Button className="w-100" variant="success" href="/login">
          Sign in
        </Button>
        <hr />
        <Button className="w-100" variant="outline-success" href="/register">
          Register
        </Button>
      </Popover.Body>
    </Popover>
  }
>
  <Image 
    roundedCircle
    src={ProfileIcon}
    style={{height: "35px", padding: "5px", backgroundColor: "orange"}}
    className="cursor-pointer"
  />
</OverlayTrigger>



            <Dropdown>
              <Dropdown.Toggle as={IconToggle}>
              <Image roundedCircle
            src={CartIcon}
            style={{height: "35px", padding: "5px", backgroundColor: "orange"}} ></Image>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item>You have no new messages.</Dropdown.Item>
              </Dropdown.Menu>

            </Dropdown>
          </Col>
        </Navbar>
      </header>
      <main className="content" style={{minHeight: "85vh"}}>{children}</main>
      <Footer />
    </div>
  );
}
