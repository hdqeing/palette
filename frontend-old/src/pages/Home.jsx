import { useEffect, useState } from "react";
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
import ShoppingCartItem from "../components/ShoppingCartItem";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../contexts/CartContext";


export default function Home() {

    const location = useLocation();
const { addToCart } = useCart(); // Destructure addToCart from the context
      const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sorts, setSorts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/sorts")
      .then(response => response.json())
      .then(data => setSorts(data))
      .catch(error => console.error("Error fetching sorts:", error));
  }, []);


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

  const navigate = useNavigate(); // Use the navigate function
  const [showCartFab, setShowCartFab] = useState(true);


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
  console.log(JSON.stringify(selectedProduct));
  console.log(JSON.stringify(quantity));
  
  // Use addToCart instead of setCart
  addToCart({ pallet: selectedProduct, quantity: quantity });
  
  setShowModal(false);
    }
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleNextStep = () => {
    // Navigate to the suppliers page
    navigate("/supplier", {
      state: {
        cart: cart,
      }
    });
  };

  const handleSubmitPallet = (pallet) => {
    setSelectedProduct(pallet);
    setShowModal(true);
  }




  return (
    <>

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
        {sorts.map((sort) => {

          return (
            <div className="col mt-3" key={sort.id}>
              <PaletteCard
                id={sort.id}
                name={sort.name}
                length={sort.length}
                width={sort.width}
                height={sort.height}
                onSubmitPallet={handleSubmitPallet}
              />
            </div>
          );})

        }

      </div>



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
