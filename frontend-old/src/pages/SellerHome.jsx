import React, { useState } from "react";
import { Card, Button, Row, Col, Container, Table } from "react-bootstrap";
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";
import ReactCountryFlag from "react-country-flag";


const cardsData = [
  {
    id: 1,
    customer: {
        name: "Prologistik GmbH",
        country: "de"
    },
    items: [
        {
            name: "Europalette",
            quantity: 50,
            suggestedPrice: 10
        },
        {
            name: "Chemiepalette",
            quantity: 50,
            suggestedPrice: 5
        }
    ]
  },
  {
    id: 2,
    customer: {
        name: "Spedition Innsbruck GmbH",
        country: "at"
    },
    items: [
        {
            name: "Europalette",
            quantity: 200,
            suggestedPrice: 9
        }
    ]
  }

];

const SellerHome = () => {
  const [startIndex, setStartIndex] = useState(0);
  const cardsPerRow = 3;

  const handleNext = () => {
    if (startIndex + cardsPerRow < cardsData.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <div className="d-flex align-items-center">
      <Button variant="light" onClick={handlePrev} disabled={startIndex === 0}>
        <ArrowLeft />
      </Button>
      <Row className="flex-nowrap overflow-hidden mx-2">
        {cardsData.slice(startIndex, startIndex + cardsPerRow).map((card) => (
          <Col key={card.id} className="px-1">
            <Card>
              <Card.Body>
                <Container className="d-flex">
                    <Card.Title>{card.customer.name}</Card.Title>
                    <ReactCountryFlag countryCode={card.customer.country} svg />
                </Container>
                <Container>
                <Table>
                    <thead>
                        <tr>
                        <th></th>
                        <th>Quantity</th>
                        <th>Propose</th>
                        </tr>
                    </thead>
                    <tbody>
                    {card.items.map((item, index) => (
                        <tr key={item.id || index}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.suggestedPrice}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                </Container>

              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Button
        variant="light"
        onClick={handleNext}
        disabled={startIndex + cardsPerRow >= cardsData.length}
      >
        <ArrowRight />
      </Button>
    </div>
  );
};

export default SellerHome;
