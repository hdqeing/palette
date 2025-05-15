import { useState } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import CloseButton from "react-bootstrap/CloseButton";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {  FloatingLabel, Offcanvas } from "react-bootstrap";
import ShoppingCart from "../assets/cart.svg";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import AddIcon from '../assets/add.svg'

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
import PaletteCard from "../components/PaletteCard";

export default function Home() {
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);


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

  const products = [
    {
      "id": 1,
      "name": "EPAL Europalette",
      "length": 800,
      "width": 1200,
      "height": 144,
      "loadCapacity": 1500,
      "category": "EPAL Europalette"
    },
    {
      "id": 3,
      "name": "EPAL 2",
      "length": 1200,
      "width": 1000,
      "height": 162,
      "loadCapacity": 1250,
      "category": "EPAL 2"
    },
    {
      "id": 5,
      "name": "EPAL 3",
      "length": 1000,
      "width": 1200,
      "height": 144,
      "loadCapacity": 1500,
      "category": "EPAL 3"
    },
    {
      "id": 6,
      "name": "EPAL 3",
      "length": 1000,
      "width": 1200,
      "height": 144,
      "loadCapacity": 1500,
      "state": "used",
      "category": "EPAL 3"
    },
    {
      "id": 7,
      "name": "EPAL 6 Halbpalette",
      "length": 800,
      "width": 600,
      "height": 144,
      "loadCapacity": 750,
      "state": "new",
      "category": "EPAL 6 Halbpalette"
    },
    {
      "id": 8,
      "name": "EPAL 6 Halbpalette",
      "length": 800,
      "width": 600,
      "height": 144,
      "loadCapacity": 750,
      "state": "used",
      "category": "EPAL 6 Halbpalette"
    },
    {
      "id": 9,
      "name": "EPAL 7 Halbpalette",
      "length": 800,
      "width": 600,
      "height": 163,
      "loadCapacity": 500,
      "state": "new",
      "category": "EPAL 7 Halbpalette"
    },
    {
      "id": 10,
      "name": "EPAL 7 Halbpalette",
      "length": 800,
      "width": 600,
      "height": 163,
      "loadCapacity": 500,
      "state": "used",
      "category": "EPAL 7 Halbpalette"
    },
    {
      "id": 11,
      "name": "EPAL Gitterbox",
      "length": 800,
      "width": 1200,
      "height": 970,
      "loadCapacity": 1500,
      "state": "new",
      "category": "EPAL Gitterbox"
    },
    {
      "id": 12,
      "name": "EPAL Gitterbox",
      "length": 800,
      "width": 1200,
      "height": 970,
      "loadCapacity": 1500,
      "state": "used",
      "category": "EPAL Gitterbox"
    },
    {
      "id": 13,
      "name": "EPAL CP1 Palette",
      "length": 1000,
      "width": 1200,
      "height": 138,
      "loadCapacity": null,
      "state": "new",
      "category": "EPAL CP-Palette"
    },
    {
      "id": 14,
      "name": "EPAL CP1 Palette",
      "length": 1000,
      "width": 1200,
      "height": 138,
      "loadCapacity": null,
      "state": "used",
      "category": "EPAL CP-Palette"
    },
    {
      "id": 15,
      "name": "EPAL CP2 Palette",
      "length": 800,
      "width": 1200,
      "height": 138,
      "loadCapacity": null,
      "state": "new",
      "category": "EPAL CP-Palette"
    },
    {
      "id": 16,
      "name": "EPAL CP2 Palette",
      "length": 800,
      "width": 1200,
      "height": 138,
      "loadCapacity": null,
      "state": "used",
      "category": "EPAL CP-Palette"
    },
    {
      "id": 17,
      "name": "EPAL CP3 Palette",
      "length": 1140,
      "width": 1140,
      "height": 138,
      "loadCapacity": null,
      "state": "new",
      "category": "EPAL CP-Palette"
    },
    {
      "id": 18,
      "name": "EPAL CP3 Palette",
      "length": 1140,
      "width": 1140,
      "height": 138,
      "loadCapacity": null,
      "state": "used",
      "category": "EPAL CP-Palette"
    },
    {
      "id": 19,
      "name": "EPAL CP4 Palette",
      "length": 1100,
      "width": 1300,
      "height": 138,
      "loadCapacity": null,
      "state": "new",
      "category": "EPAL CP-Palette"
    },
    {
      "id": 20,
      "name": "EPAL CP4 Palette",
      "length": 1100,
      "width": 1300,
      "height": 138,
      "loadCapacity": null,
      "state": "used",
      "category": "EPAL CP-Palette"
    },
    {
      "id": 21,
      "name": "EPAL CP5 Palette",
      "length": 760,
      "width": 1140,
      "height": 138,
      "loadCapacity": null,
      "state": "new",
      "category": "EPAL CP-Palette"
    },
    {
      "id": 22,
      "name": "EPAL CP5 Palette",
      "length": 760,
      "width": 1140,
      "height": 138,
      "loadCapacity": null,
      "state": "used",
      "category": "EPAL CP-Palette"
    },
    {
      "id": 23,
      "name": "EPAL CP6 Palette",
      "length": 1200,
      "width": 1000,
      "height": 156,
      "loadCapacity": null,
      "state": "new",
      "category": "EPAL CP-Palette"
    },
    {
      "id": 24,
      "name": "EPAL CP6 Palette",
      "length": 1200,
      "width": 1000,
      "height": 156,
      "loadCapacity": null,
      "state": "used",
      "category": "EPAL CP-Palette"
    },
    {
      "id": 25,
      "name": "EPAL CP7 Palette",
      "length": 1300,
      "width": 1100,
      "height": 156,
      "loadCapacity": null,
      "state": "new",
      "category": "EPAL CP-Palette"
    },
    {
      "id": 26,
      "name": "EPAL CP7 Palette",
      "length": 1300,
      "width": 1100,
      "height": 156,
      "loadCapacity": null,
      "state": "used",
      "category": "EPAL CP-Palette"
    },
    {
      "id": 27,
      "name": "EPAL CP8 Palette",
      "length": 1140,
      "width": 1140,
      "height": 156,
      "loadCapacity": null,
      "state": "new",
      "category": "EPAL CP-Palette"
    },
    {
      "id": 28,
      "name": "EPAL CP8 Palette",
      "length": 1140,
      "width": 1140,
      "height": 156,
      "loadCapacity": null,
      "state": "used",
      "category": "EPAL CP-Palette"
    },
    {
      "id": 29,
      "name": "EPAL CP9 Palette",
      "length": 1140,
      "width": 1140,
      "height": 156,
      "loadCapacity": null,
      "state": "new",
      "category": "EPAL CP-Palette"
    },
    {
      "id": 30,
      "name": "EPAL CP9 Palette",
      "length": 1140,
      "width": 1140,
      "height": 156,
      "loadCapacity": null,
      "state": "used",
      "category": "EPAL CP-Palette"
    }
  ]

  const productCategories = [
    {
      id: 1,
      name: "EPAL Europalette",
    },
    {
      id: 2,
      name: "EPAL 2",
    },
    {
      id: 3,
      name: "EPAL 3"
    },
    {
      id: 4,
      name: "EPAL 6 Halbpalette",
    },
    {
      id: 5,
      name: "EPAL 7 Halbpalette",
    },
    {
      id: 6,
      name: "EPAL Gitterbox"
    },
    {
      id: 7,
      name: "EPAL CP-Palette"
    }
  ];

  const navigate = useNavigate(); // Use the navigate function
  const [showCart, setShowCart] = useState(false);
  const [showCartFab, setShowCartFab] = useState(true);

  const handleShowCart = () => {
    setShowCart(true);
    setShowCartFab(false);
  }

  const handleHideCart = () => {
    setShowCart(false);
    setShowCartFab(true);
  }

  function handleAddToCartClick(e) {
    e.preventDefault(); // prevent form from reloading the page
    const formData = new FormData(e.target);
    const features = ["category", "length", "width", "height", "state"];

    const data = {};
    features.forEach((key) => {
      const value = formData.get(key);
      if (value) {
        data[key] = value;
      }
    });

    const match = products.find(obj => Object.entries(data).every(([key, value]) => String(obj[key]) === String(value)))
    console.log(JSON.stringify(data))
    if (match) {
      console.log("You selected product ", match.id)
    } else {
      console.log("Your Prodct is not valid")
    }

  };

  const handleConfirmAddToCart = () => {
    if (selectedProduct && quantity > 0) {
      setCart([...cart, { ...selectedProduct, quantity }]);
      setShowModal(false);
    }
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleNextStep = () => {
    // Navigate to the suppliers page
    navigate("/supplier");
  };




  return (
    <>
      <header style={{backgroundColor: "bisque", height: "10vh"}}>
        <Navbar style={{width: "75%", margin: "0 auto"}}>
          <Col>
            <Navbar.Brand href="#home">
              <Image src={PaletteIcon} style={{height: "100px"}}></Image>
            </Navbar.Brand> 
          </Col>
          <Col className="d-flex justify-content-end gap-3">

            <OverlayTrigger trigger="click" placement="bottom" rootClose
            overlay={
              <Popover id="notification-popover" className="notification-popover">
                <Popover.Body>
                  You have no new messages.
                </Popover.Body>
              </Popover>
            }>
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

            <Image roundedCircle
            src={CartIcon}
            onClick={handleShowCart}
            style={{height: "35px", padding: "5px", backgroundColor: "orange", cursor: "pointer"}} ></Image>

          </Col>
        </Navbar>
      </header>

      <div className="row row-cols-1 row-cols-md-2" style={{ width: "75%", margin: "0 auto" }}>
        {/* Static card that always appears first */}
        <div className="col mt-3">
          <Card className="h-100 text-center d-flex flex-row">
            <div className="d-flex justify-content-center" style={{ width: "200px"}}>
              <Card.Img variant="top" src={AddIcon} style={{ width: "100px"}}/>
            </div>
            
            <Card.Body className="d-flex flex-column justify-content-center align-items-center">
              <Card.Title>Custom Product</Card.Title>
              <Card.Text>Create your own customized product to suit your needs.</Card.Text>
              <Button variant="success" onClick={() => handleCustomizeProductClick() } style={{ width: "50%"}}>
                Customize Product
              </Button>
            </Card.Body>
          </Card>
        </div>
        
        {/* Dynamically rendered product cards */}
        {productCategories.map((category) => {
          const productsInCategory = products.filter(product => product.category === category.name);

          return (
            <div className="col mt-3" key={category.id}>
              <PaletteCard></PaletteCard>

            </div>
          );
})}

      </div>

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
              <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                {item.title} (x{item.quantity})
                <CloseButton onClick={() => removeFromCart(index)} />
              </ListGroup.Item>
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


      {/* Quantity Selection Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Quantity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>How many would you like to add?</p>
          <Form.Control
            type="number"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmAddToCart}>
            Add to Cart
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
