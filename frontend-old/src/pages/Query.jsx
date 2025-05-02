import { useState } from "react";
import { Accordion, Card, ListGroup, Form, Button } from "react-bootstrap";

export default function Query() {
  // Array of queries, each containing offers from sellers
  const [selectedSellers, setSelectedSellers] = useState({}); // Track selected seller per query
  
  const queries = [
    {
      id: 1,
      title: "Query 1",
      content: "This is the first query. You can add relevant information here.",
      offers: [
        { sellerName: "Seller 1", price: "€100", deliverDate: "2025-03-30" },
        { sellerName: "Seller 2", price: "€90", deliverDate: "2025-04-05" },
      ],
    },
    {
      id: 2,
      title: "Query 2",
      content: "This is the second query. Add more details here.",
      offers: [
        { sellerName: "Seller 3", price: "€120", deliverDate: "2025-04-01" },
        { sellerName: "Seller 4", price: "€110", deliverDate: "2025-04-10" },
      ],
    },
  ];

  // Handle the selection of a seller
  const handleSellerSelection = (queryId, sellerName) => {
    setSelectedSellers((prevState) => ({
      ...prevState,
      [queryId]: sellerName, // Store the selected seller for this query
    }));
  };

  // Handle placing an order for the selected seller
  const handlePlaceOrder = (queryId) => {
    const selectedSeller = selectedSellers[queryId];
    if (selectedSeller) {
      alert(`Order placed for ${selectedSeller} in Query ${queryId}`);
    } else {
      alert("Please select a seller before placing an order.");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ width: '50%', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        {/* Accordion for rendering queries */}
        <Accordion defaultActiveKey="0">
          {queries.map((query) => (
            <Accordion.Item eventKey={query.id.toString()} key={query.id}>
              <Accordion.Header>{query.title}</Accordion.Header>
              <Accordion.Body>
                <p>{query.content}</p>

                {/* Offers from sellers */}
                <ListGroup>
                  {query.offers.map((offer, index) => (
                    <ListGroup.Item key={index}>
                      <Form.Check
                        type="radio"
                        id={`seller-${offer.sellerName}`}
                        name={`query-${query.id}`}
                        label={`${offer.sellerName} - ${offer.price} (Delivery: ${offer.deliverDate})`}
                        checked={selectedSellers[query.id] === offer.sellerName}
                        onChange={() => handleSellerSelection(query.id, offer.sellerName)}
                      />
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                {/* Place Order Button */}
                <Button
                  variant="success"
                  style={{ marginTop: '20px' }}
                  onClick={() => handlePlaceOrder(query.id)}
                >
                  Place Order
                </Button>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
