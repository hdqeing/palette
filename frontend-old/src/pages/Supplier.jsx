import { SearchOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Row, Col, Button, Form, InputGroup, Card, Container, Accordion, Alert, Spinner } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

export default function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { cart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch suppliers only once when component mounts
    setLoading(true);
    fetch("http://localhost:8080/sellers")
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch suppliers');
        return res.json();
      })
      .then(data => {
        setSuppliers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching suppliers:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [isAuthenticated, navigate]);

  const handleCheckboxChange = (supplierId) => {
    setSelectedSuppliers(prev => {
      if (prev.includes(supplierId)) {
        // Remove from selected
        return prev.filter(id => id !== supplierId);
      } else {
        // Add to selected
        return [...prev, supplierId];
      }
    });
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    
    if (selectedSuppliers.length === 0) {
      alert('Please select at least one supplier');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before proceeding.');
      navigate('/');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Prepare the request body according to the API specification
      const requestBody = {
        sellers: selectedSuppliers, // Array of supplier IDs
        itemQuantities: cart.map(item => ({
          palletId: item.pallet.id,
          quantity: item.quantity
        }))
      };

      console.log('Sending query request:', requestBody);

      // Get auth token
      const authToken = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:8080/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` // Include auth token if needed
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Query endpoint not found. Please check the API.');
        }
        throw new Error(`Request failed with status: ${response.status}`);
      }

      // Get the response text
      const responseData = await response.text();
      console.log('Query response:', responseData);

      // Navigate to the query results page with the response
      navigate('/query', { 
        state: { 
          queryResult: responseData,
          selectedSuppliers: suppliers.filter(s => selectedSuppliers.includes(s.id)),
          cart: cart 
        } 
      });

    } catch (err) {
      console.error('Error submitting query:', err);
      setError(err.message || 'Failed to submit query. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading suppliers...</span>
          </Spinner>
          <p className="mt-2">Loading suppliers...</p>
        </div>
      </Container>
    );
  }

  if (error && !submitting) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          Error loading suppliers: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Select Suppliers</h2>
      
      {cart && cart.length > 0 ? (
        <Alert variant="info" className="mb-4">
          You have {cart.length} different item(s) in your cart with a total of{' '}
          {cart.reduce((total, item) => total + item.quantity, 0)} units
        </Alert>
      ) : (
        <Alert variant="warning" className="mb-4">
          Your cart is empty. <Link to="/">Add items</Link> before selecting suppliers.
        </Alert>
      )}

      <Form onSubmit={handleNextStep}>
        <Card>
          <Card.Body>
            {suppliers.length === 0 ? (
              <p className="text-muted">No suppliers available</p>
            ) : (
              suppliers.map((supplier) => (
                <Row key={supplier.id} className="mb-3 align-items-center border-bottom pb-3">
                  <Col xs={1}>
                    <Form.Check>
                      <Form.Check.Input 
                        type="checkbox"
                        id={`supplier-${supplier.id}`}
                        className="border border-2 border-primary"
                        style={{ 
                          width: '1.5em',
                          height: '1.5em',
                          cursor: 'pointer'
                        }}
                        checked={selectedSuppliers.includes(supplier.id)}
                        onChange={() => handleCheckboxChange(supplier.id)}
                        disabled={submitting}
                      />
                    </Form.Check>
                  </Col>
                  <Col xs={5}>
                    <Form.Label 
                      htmlFor={`supplier-${supplier.id}`}
                      className="mb-0 fw-semibold"
                      style={{ cursor: 'pointer' }}
                    >
                      {supplier.title || supplier.name}
                    </Form.Label>
                  </Col>
                  <Col xs={6}>
                    <div className="text-muted small">
                      {supplier.street} {supplier.houseNumber}
                      <br />
                      {supplier.postalCode} {supplier.city}
                    </div>
                  </Col>
                </Row>
              ))
            )}
          </Card.Body>
        </Card>

        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}

        <div className="mt-4 d-flex justify-content-between">
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            Back
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={suppliers.length === 0 || cart.length === 0 || submitting}
          >
            {submitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Processing...
              </>
            ) : (
              `Next Step (${selectedSuppliers.length} selected)`
            )}
          </Button>
        </div>
      </Form>
    </Container>
  );
}