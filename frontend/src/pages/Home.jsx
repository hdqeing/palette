import { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import CloseButton from "react-bootstrap/CloseButton";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

export default function Home() {
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const products = [
    { id: 1, title: "Europalette", description: "Beschreibung Europalette" },
    { id: 2, title: "Chemie Palette", description: "Bestellung Chemiepalette" },
  ];

  const navigate = useNavigate(); // Use the navigate function

  const handleAddToCartClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1); // Reset quantity when opening modal
    setShowModal(true);
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
    <div className="d-flex flex-column h-screen p-3">
      {/* Header */}
      <header className="mb-3">
        <h2>Shop</h2>
      </header>

      {/* Main Content */}
      <div className="d-flex flex-grow-1 gap-3">
        {/* Product List */}
        <div className="flex-grow-1 d-flex flex-wrap gap-3">
          {products.map((product) => (
            <Card key={product.id} style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Button variant="primary" onClick={() => handleAddToCartClick(product)}>
                  Add to shopping cart
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Shopping Cart */}
        <div
          className="shopping-cart p-3"
          style={{
            width: "300px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            boxShadow: "-5px 0 10px rgba(0,0,0,0.1)",
            overflowY: "auto",
            borderRadius: "10px",
          }}
        >
          <h5 className="text-center">Shopping Cart</h5>
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
        </div>
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
    </div>
  );
}
