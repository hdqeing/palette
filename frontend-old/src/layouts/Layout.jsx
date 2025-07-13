import { Navbar, Button, Offcanvas, Image, Col} from "react-bootstrap";
import Footer from "../components/Footer";
import "./Layout.css";
import PaletteIcon from "../assets/iconPalette.svg";
import NotificationIcon from "../assets/notifications.svg";
import ProfileIcon from "../assets/profile.svg";
import CartIcon from "../assets/cart.svg";
import { useState } from "react";
import { OverlayTrigger, Popover, ListGroup, Spinner } from 'react-bootstrap';
import { useCart } from "../contexts/CartContext.jsx";
import ShoppingCartItem from "../components/ShoppingCartItem"; // Make sure to import this
import { useNavigate } from 'react-router-dom'; // If using React Router
import { useAuth } from '../contexts/AuthContext';
import { Link } from "react-router-dom";

export default function Layout({ children }) {
  const [showCart, setShowCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();


  const { cart } = useCart(); // Use the custom hook
  const navigate = useNavigate(); // If using React Router

  const handleShowCart = () => {
    setShowCart(true);
  }

  const handleHideCart = () => {
    setShowCart(false);
  }

  const handleShowProfile = () => {
    setShowProfile(true);
  }

  const handleHideProfile = () => {
    setShowProfile(false);
  }

  const handleShowNotification = () => {
    setShowNotification(true);
  }

  const handleHideNotification = () => {
    setShowNotification(false);
  }


  const handleNextStep = () => {
    handleHideCart();
    navigate('/supplier'); // Or wherever you want to navigate
  }

const handleLogout = () => {
  // Your logout logic here
  handleHideProfile(); // Close the offcanvas after logout
};

const handleLogin = () => {
  // Navigate to login page or show login modal
  handleHideProfile();
};

const handleSignUp = () => {
  // Navigate to sign up page or show sign up modal
  handleHideProfile();
};

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

            <div style={{ position: 'relative' }}>
              <Image 
                roundedCircle
                src={NotificationIcon}
                style={{height: "35px", padding: "5px", backgroundColor: "orange"}}
                className="cursor-pointer"
                onClick={handleShowNotification}
              />
            </div>


            <div style={{ position: 'relative' }}>
              <Image 
                roundedCircle
                src={ProfileIcon}
                style={{height: "35px", padding: "5px", backgroundColor: "orange"}}
                onClick={handleShowProfile}
                className="cursor-pointer"
              />
            </div>


            <div style={{ position: 'relative' }}>
              <Image 
                roundedCircle
                src={CartIcon}
                onClick={handleShowCart}
                style={{height: "35px", padding: "5px", backgroundColor: "orange", cursor: "pointer"}} 
              />
              {cart.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px',
                  backgroundColor: 'red',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {cart.length}
                </span>
              )}
            </div>
          </Col>
        </Navbar>
      </header>

      <Offcanvas show={showNotification} placement='end' onHide={handleHideNotification}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Messages</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>

        </Offcanvas.Body>
      </Offcanvas>


<Offcanvas show={showProfile} placement='end' onHide={handleHideProfile}>
  <Offcanvas.Header closeButton>
    <Offcanvas.Title>My Account</Offcanvas.Title>
  </Offcanvas.Header>
  <Offcanvas.Body>
    {isLoading ? (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    ) : isAuthenticated ? (
      <div className="d-flex flex-column gap-3">
        <Link to="/query" className="text-decoration-none" onClick={handleHideProfile}>
          Query
        </Link>
        <Link to="/orders" className="text-decoration-none" onClick={handleHideProfile}>
          Orders
        </Link>
        <Link to="/profile" className="text-decoration-none" onClick={handleHideProfile}>
          Profile
        </Link>
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    ) : (
      <div className="d-flex flex-column gap-3">
        <Button variant="primary" href="/login">
          Login
        </Button>
        <Button variant="outline-primary" onClick={handleSignUp}>
          Sign Up
        </Button>
      </div>
    )}
  </Offcanvas.Body>
</Offcanvas>

      <Offcanvas show={showCart} placement='end' onHide={handleHideCart}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Shopping Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ListGroup>
            {cart.length === 0 ? (
              <ListGroup.Item className="text-muted">Cart is empty</ListGroup.Item>
            ) : (
              cart.map((item, index) => (
                <ShoppingCartItem
                  key={item.pallet.id || index}
                  url={item.pallet.url}
                  name={item.pallet.sort.name}
                  quality={item.pallet.quality}
                  quantity={item.quantity}
                />
              ))
            )}
          </ListGroup>
          {cart.length > 0 && (
            <Button
              variant="success"
              className="w-100 mt-3"
              onClick={handleNextStep}
            >
              Next Step
            </Button>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      <main className="content" style={{minHeight: "85vh"}}>
        {children}
      </main>

      <Footer />
    </div>
  );
}