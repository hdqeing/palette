import React, { useState } from "react";
import { Accordion, Table, Button, Form } from "react-bootstrap";
export default function SellerQuery() {

    const inquiries = [
        {
          id: 1,
          title: "Inquiry 1: 50 Europaletten & 50 Chemiepaletten",
          description: "Customer has not provided a price suggestion.",
          customerName: "John Doe",
          items: [
            { name: "Europalette", quantity: 50, suggestedPrice: null },
            { name: "Chemiepalette", quantity: 50, suggestedPrice: null },
          ],
        },
        {
          id: 2,
          title: "Inquiry 2: 75 Europaletten & 25 Chemiepaletten",
          description: "Customer suggested price per item:",
          customerName: "Jane Smith",
          items: [
            { name: "Europalette", quantity: 75, suggestedPrice: "6 EUR" },
            { name: "Chemiepalette", quantity: 25, suggestedPrice: "8 EUR" },
          ],
        },
      ];

      const [sellerPrices, setSellerPrices] = useState({});

      const handlePriceChange = (id, type, value) => {
        setSellerPrices((prev) => ({
          ...prev,
          [id]: { ...prev[id], [type]: value },
        }));
      };
      const handleAcceptSuggestedPrice = (id, itemName, suggestedPrice) => {
        setSellerPrices((prev) => ({
          ...prev,
          [id]: { ...prev[id], [itemName]: suggestedPrice },
        }));
      };
      
    return (
        <div className="container mt-4">
        <h2>Price Inquiries</h2>
        <Accordion>
          {inquiries.map((inquiry, index) => (
            <Accordion.Item eventKey={index.toString()} key={inquiry.id}>
              <Accordion.Header>
              <h5>Customer: {inquiry.customerName}</h5>
              </Accordion.Header>
              <Accordion.Body>
              <Table bordered>
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Suggested Price</th>
                    <th>My Offer</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiry.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.suggestedPrice || "N/A"}</td>
                      <td>
                        <Form.Control
                          type="text"
                          placeholder="Enter your price"
                          value={sellerPrices[inquiry.id]?.[item.name] || ""}
                          onChange={(e) => handlePriceChange(inquiry.id, item.name, e.target.value)}
                        />
                      </td>
                      <td>
                        {item.suggestedPrice && (
                          <Button 
                            variant="success" 
                            onClick={() => handleAcceptSuggestedPrice(inquiry.id, item.name, item.suggestedPrice)}
                          >
                            Agree Suggested Price
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="mt-2">
                <Button variant="danger" className="me-2">Ignore This Inquiry</Button>
                <Button variant="primary">Send My Bid</Button>
              </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    )
}