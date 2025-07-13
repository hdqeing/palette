import { useState, useEffect } from "react";
import { Accordion, Card, ListGroup, Form, Button, Container, Alert, Spinner, Badge, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Query() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQueries, setSelectedQueries] = useState({});
  
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Get any state passed from the supplier page
  const { queryResult } = location.state || {};

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch queries
    fetchQueries();
  }, [isAuthenticated, navigate]);

  const fetchQueries = async () => {
    setLoading(true);
    setError(null);

    try {
      const authToken = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:8080/queries', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No queries found');
        }
        throw new Error(`Failed to fetch queries: ${response.status}`);
      }

      const data = await response.json();
      setQueries(data);
    } catch (err) {
      console.error('Error fetching queries:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuerySelection = (queryId) => {
    setSelectedQueries(prev => ({
      ...prev,
      [queryId]: !prev[queryId]
    }));
  };

  const handleApproveQueries = async () => {
    const selectedQueryIds = Object.keys(selectedQueries).filter(id => selectedQueries[id]);
    
    if (selectedQueryIds.length === 0) {
      alert('Please select at least one query to approve');
      return;
    }

    // Here you would typically make an API call to approve the queries
    // For now, we'll just show an alert
    alert(`Approving queries: ${selectedQueryIds.join(', ')}`);
    
    // Refresh the queries list
    await fetchQueries();
  };

  const calculateTotalPrice = (items) => {
    return items.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getQueryTitle = (query) => {
    const date = new Date(query.createdAt);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year} Query`;
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading queries...</span>
          </Spinner>
          <p className="mt-2">Loading queries...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchQueries}>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Queries</h2>
        <Button 
          variant="outline-secondary" 
          onClick={fetchQueries}
          size="sm"
        >
          Refresh
        </Button>
      </div>

      {queryResult && (
        <Alert variant="info" dismissible className="mb-4">
          <Alert.Heading>New Query Submitted</Alert.Heading>
          <p>{queryResult}</p>
        </Alert>
      )}

      {queries.length === 0 ? (
        <Alert variant="info">
          No queries found. Create a new query by selecting suppliers from your cart.
        </Alert>
      ) : (
        <>
          <Accordion defaultActiveKey="0">
            {queries.map((query, index) => (
              <Accordion.Item eventKey={index.toString()} key={query.id}>
                <Accordion.Header>
                  <div className="d-flex justify-content-between align-items-center w-100 me-2">
                    <span>
                      {getQueryTitle(query)}
                    </span>
                    <div>
                      {query.sellerApproved && (
                        <Badge bg="success" className="me-2">Seller Approved</Badge>
                      )}
                      {query.buyerApproved && (
                        <Badge bg="primary">Buyer Approved</Badge>
                      )}
                      {!query.sellerApproved && !query.buyerApproved && (
                        <Badge bg="warning">Pending Approval</Badge>
                      )}
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="mb-3">
                    <small className="text-muted">
                      Created: {formatDate(query.createdAt)}
                    </small>
                  </div>

                  {/* Items Table */}
                  <Card className="mb-3">
                    <Card.Header>
                      <h6 className="mb-0">Items in this Query</h6>
                    </Card.Header>
                    <Card.Body>
                      <Table responsive hover size="sm">
                        <thead>
                          <tr>
                            <th>Pallet ID</th>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {query.items.map((item, itemIndex) => (
                            <tr key={itemIndex}>
                              <td>{item.palletId}</td>
                              <td>{item.palletName || 'N/A'}</td>
                              <td>{item.quantity || 0}</td>
                              <td>€{(item.price || 0).toFixed(2)}</td>
                              <td>€{((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <th colSpan="4" className="text-end">Total:</th>
                            <th>€{calculateTotalPrice(query.items).toFixed(2)}</th>
                          </tr>
                        </tfoot>
                      </Table>
                    </Card.Body>
                  </Card>

                  {/* Action buttons based on approval status */}
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      {!query.buyerApproved && (
                        <Form.Check
                          type="checkbox"
                          id={`select-query-${query.id}`}
                          label="Select for approval"
                          checked={selectedQueries[query.id] || false}
                          onChange={() => handleQuerySelection(query.id)}
                        />
                      )}
                    </div>
                    
                    <div>
                      {query.sellerApproved && query.buyerApproved ? (
                        <Button 
                          variant="success"
                          onClick={() => navigate('/order', { state: { query } })}
                        >
                          View Order Details
                        </Button>
                      ) : query.sellerApproved && !query.buyerApproved ? (
                        <Badge bg="info">Awaiting Your Approval</Badge>
                      ) : (
                        <Badge bg="secondary">Awaiting Seller Response</Badge>
                      )}
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>

          {/* Bulk approval button */}
          {queries.some(q => !q.buyerApproved) && (
            <div className="mt-4 text-center">
              <Button 
                variant="primary" 
                size="lg"
                onClick={handleApproveQueries}
                disabled={!Object.values(selectedQueries).some(v => v)}
              >
                Approve Selected Queries
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
}