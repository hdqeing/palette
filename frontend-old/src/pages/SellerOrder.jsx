import React, { useState } from "react";
import { Accordion, Table, Button, Form, Container } from "react-bootstrap";
export default function SellerOrder() {

    const orders = [
        {
          id: 1,
          customerName: "ProLogistics GmbH",
          orderType: "pickup",
          items: [
            { name: "Europalette", quantity: 50, price: 10 },
            { name: "Chemiepalette", quantity: 50, price: 8 },
          ],
          status: "In Production"
        },
        {
            id: 2,
            customerName: "Fancy Machine GmbH",
            orderType: "deliver",
            items: [
              { name: "Europalette", quantity: 200, price: 10 },
            ],
            status: "Delivered"
        },
      ];

      
    return (
        <Container>
        <h1>Orders</h1>
        <Accordion>
            {orders.map((order, index) => (
                <Accordion.Item>
                    <Accordion.Header>
                        {order.customerName}
                    </Accordion.Header>
                    <Accordion.Body>
                        <Table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item)=>(
                                    <tr>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <Button>
                            Ready for Pickup
                        </Button>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
        </Container>


    )
}