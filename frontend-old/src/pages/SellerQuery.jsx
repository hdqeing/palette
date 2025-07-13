import React, { useState, useEffect } from "react";
import { Accordion, Table, Button, Form, Alert, Spinner } from "react-bootstrap";

export default function SellerQuery() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sellerPrices, setSellerPrices] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;


  // Fetch queries from API
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Assuming JWT token is stored in localStorage
        const response = await fetch(`${API_URL}/queries/received`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setQueries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  const handlePriceChange = (queryId, palletId, value) => {
    setSellerPrices((prev) => ({
      ...prev,
      [queryId]: { 
        ...prev[queryId], 
        [palletId]: value 
      },
    }));
  };

  const handleAcceptSuggestedPrice = (queryId, palletId, suggestedPrice) => {
    setSellerPrices((prev) => ({
      ...prev,
      [queryId]: { 
        ...prev[queryId], 
        [palletId]: suggestedPrice.toString() 
      },
    }));
  };

  const handleIgnoreInquiry = async (queryId) => {
    // You can implement the ignore functionality here
    console.log(`Ignoring inquiry ${queryId}`);
  };

  const handleSendBid = async (queryId) => {
    const prices = sellerPrices[queryId];
    if (!prices || Object.keys(prices).length === 0) {
      alert("Please enter prices for at least one item before sending your bid.");
      return;
    }
    
    // You can implement the bid sending functionality here
    console.log(`Sending bid for query ${queryId}:`, prices);
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading queries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">
          Error loading queries: {error}
        </Alert>
      </div>
    );
  }

  if (queries.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Price Inquiries</h2>
        <Alert variant="info">
          No queries received yet.
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Price Inquiries</h2>
      <Accordion>
        {queries.map((query, index) => (
          <Accordion.Item eventKey={index.toString()} key={query.id}>
            <Accordion.Header>
              <div>
                <h5>Customer: {query.buyer.name}</h5>
                <small className="text-muted">
                  Email: {query.buyer.email} | 
                  Created: {new Date(query.createdAt).toLocaleDateString()} |
                  Batch ID: {query.batchId}
                </small>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <div className="mb-3">
                <strong>Customer Address:</strong> {query.buyer.address}
              </div>
              
              <Table bordered>
                <thead>
                  <tr>
                    <th>Pallet Type</th>
                    <th>Quality</th>
                    <th>Dimensions (L×W×H)</th>
                    <th>Quantity</th>
                    <th>Suggested Price (EUR)</th>
                    <th>My Offer (EUR)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {query.items.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <div>
                          {item.palletSort.name}
                          {item.palletUrl && (
                            <div>
                              <a href={item.palletUrl} target="_blank" rel="noopener noreferrer">
                                View Image
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>{item.palletQuality}</td>
                      <td>
                        {item.palletSort.length}×{item.palletSort.width}×{item.palletSort.height} cm
                      </td>
                      <td>{item.quantity}</td>
                      <td>{item.price > 0 ? `${item.price} EUR` : "N/A"}</td>
                      <td>
                        <Form.Control
                          type="number"
                          step="0.01"
                          placeholder="Enter your price"
                          value={sellerPrices[query.id]?.[item.palletId] || ""}
                          onChange={(e) => handlePriceChange(query.id, item.palletId, e.target.value)}
                        />
                      </td>
                      <td>
                        {item.price > 0 && (
                          <Button 
                            variant="success" 
                            size="sm"
                            onClick={() => handleAcceptSuggestedPrice(query.id, item.palletId, item.price)}
                          >
                            Accept {item.price} EUR
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              <div className="mt-3 d-flex justify-content-between">
                <div>
                  <strong>Status:</strong>
                  <span className={`ms-2 badge ${query.sellerApproved ? 'bg-success' : 'bg-warning'}`}>
                    {query.sellerApproved ? 'Approved by You' : 'Pending Your Response'}
                  </span>
                  <span className={`ms-2 badge ${query.buyerApproved ? 'bg-success' : 'bg-secondary'}`}>
                    {query.buyerApproved ? 'Approved by Buyer' : 'Buyer Response Pending'}
                  </span>
                </div>
                
                <div>
                  <Button 
                    variant="danger" 
                    className="me-2"
                    onClick={() => handleIgnoreInquiry(query.id)}
                    disabled={query.sellerApproved}
                  >
                    Ignore This Inquiry
                  </Button>
                  <Button 
                    variant="primary"
                    onClick={() => handleSendBid(query.id)}
                    disabled={query.sellerApproved}
                  >
                    Send My Bid
                  </Button>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}