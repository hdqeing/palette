import { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import CloseButton from "react-bootstrap/CloseButton";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Image, Offcanvas } from "react-bootstrap";
import ShoppingCart from "../assets/cart.svg";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import AddIcon from '../assets/add.svg'

export default function Home() {
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const products = [
    {
      id: 1,
      category: "Europalette",
      length: 800,
      width: 1200,
      height: 144,
      state: "new"
    },
    {
      id: 2,
      category: "Europalette",
      length: 800,
      width: 1200,
      height: 144,
      state: "used"
    },
    {
      id: 3,
      category: "Holz-Einweg-Palette",
      length: 800,
      width: 1200,
      state: "new"
    },
    {
      id: 4,
      category: "Holz-Einweg-Palette",
      length: 800,
      width: 1200,
      state: "used"
    },
    {
      id: 5,
      category: "Holz-Einweg-Palette",
      length: 800,
      width: 1200,
      state: "new"
    },
    {
      id: 6,
      category: "Holz-Einweg-Palette",
      length: 600,
      width: 800,
      state: "new"
    },
    {
      id: 7,
      category: "IPPC-Holzpaletten",
      length: 800,
      width: 1200,
      state: "new"
    },
    {
      id: 8,
      category: "IPPC-Holzpaletten",
      length: 800,
      width: 1200,
      state: "used"
    },
    {
      id: 9,
      category: "IPPC-Holzpaletten",
      length: 1000,
      width: 1200,
      state: "new"
    },
    {
      id: 10,
      category: "IPPC-Holzpaletten",
      length: 1000,
      width: 1200,
      state: "used"
    },
    {
      id: 11,
      category: "IPPC-Holzpaletten",
      length: 600,
      width: 800,
      state: "new"
    },
    {
      id: 12,
      category: "IPPC-Holzpaletten",
      length: 600,
      width: 800,
      state: "used"
    },
    {
      id: 13,
      category: "IPPC-Holzpaletten",
      length: 400,
      width: 600,
      state: "new"
    },
    {
      id: 14,
      category: "IPPC-Holzpaletten",
      length: 400,
      width: 600,
      state: "used"
    }
  ];

  const productCategories = [
    {
      id: 1,
      name: "Europalette",
      picture: "https://dbschenkereuropac-shop.dbschenker.com/media/db/61/2a/1592302558/Europalette_Hauptbild.jpg?ts=1744892710"
    },
    {
      id: 2,
      name: "Holz-Einweg-Palette",
      picture: "https://dbschenkereuropac-shop.dbschenker.com/thumbnail/d0/2c/f6/1592302565/einwegpalette_1_800x800.jpg?ts=1592302920"
    },
    {
      id: 3,
      name: "IPPC-Holzpaletten",
      picture: "https://dbschenkereuropac-shop.dbschenker.com/thumbnail/37/07/9e/1592302564/einwegpaletten_klein_ohneippc_1_800x800.jpg?ts=1592302907"
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
    <>

      {/* Main Content */}
        {/* Product List */}
  <div className="row row-cols-1 row-cols-md-2" style={{ width: "75%", margin: "0 auto" }}>
    {/* Static card that always appears first */}
    <div className="col mt-3">
      <Card className="h-100 text-center d-flex flex-row">
        <div className="d-flex justify-content-center" style={{ width: "200px"}}>
          <Card.Img variant="top" src={AddIcon} style={{ width: "100px"}}/>
        </div>
        
        <Card.Body>
          <Card.Title>Custom Product</Card.Title>
          <Card.Text>Create your own customized product to suit your needs.</Card.Text>
          <Button variant="success" onClick={() => handleCustomizeProductClick()}>
            Customize Product
          </Button>
        </Card.Body>
      </Card>
    </div>
    
    {/* Dynamically rendered product cards */}
    {productCategories.map((category) => {
      let productsInCategory = products.filter(product => product.category === category.name)
      return (
        <div className="col mt-3" key={category.id}>
          <Card className="h-100 d-flex flex-row">
            <Card.Img src={category.picture} style={{ width: "200px" }}></Card.Img>
            <Card.Body>
              <Card.Title>{category.name}</Card.Title>
              <Form.Label>Length</Form.Label>
              <Form.Select>
                {[...new Set(productsInCategory.map(product => product.length))].map((uniqueLength => (
                  <option>{uniqueLength}</option>
                )))}
              </Form.Select>
              <Form.Label>Width</Form.Label>
              <Form.Select>
                {[...new Set(productsInCategory.map(product => product.width))].map((uniqueWidth => (
                  <option>{uniqueWidth}</option>
                )))}
              </Form.Select>
              <Form.Label>Height</Form.Label>
              <Form.Select>
                {[...new Set(productsInCategory.map(product => product.height))].map((uniqueHeight => (
                  <option>{uniqueHeight}</option>
                )))}
              </Form.Select>
              <Form.Label>State</Form.Label>
              <Form.Select>
                {[...new Set(productsInCategory.map(product => product.state))].map((uniqueState => (
                  <option>{uniqueState}</option>
                )))}
              </Form.Select>
              
                
              
              
              
              <Button variant="primary" onClick={() => handleAddToCartClick(product)}>
                Add to shopping cart
              </Button>
            </Card.Body>
          </Card>
        </div>
      )
    }
    )}
  </div>

        {/* Shopping Cart */}
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
