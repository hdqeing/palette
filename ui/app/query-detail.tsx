import { Badge, Breadcrumb, Button, Col, Form, Row } from "react-bootstrap";
import type { Route } from "./+types/root";
import { useEffect, useState } from "react";

export default function QueryDetailComponent({
  loaderData,
  actionData,
  params,
  matches,
}: Route.ComponentProps) {
    
    const API_URL = import.meta.env.VITE_API_URL;

    const [pallets, setPallets] = useState([]);

    const fetchPallets = async () => {
        const response = await fetch(`${API_URL}/v1/queries/${params.queryId}/pallets`);

        const data = await response.json();
        console.log(data)
        setPallets(data);

    }

    useEffect(()=>{fetchPallets()}, [])

  return (
    
    <>
        <Breadcrumb className="m-3">
            <Breadcrumb.Item>Palletly</Breadcrumb.Item>
            <Breadcrumb.Item href={`/query`}>Preisabfrage</Breadcrumb.Item>
            <Breadcrumb.Item active>{params.queryId}</Breadcrumb.Item>    
        </Breadcrumb>

        <Form className="m-3">
            <Row className="mb-3">
                <Col>
                <h5>Pallet</h5>
                </Col>
                {pallets.map((pallet) => {
                    return (
                        <Col className="d-flex justify-content-around">
                        <h5>{pallet.pallet.sort.name}</h5>
                        <Badge bg="success" pill>{pallet.pallet.quality}</Badge>
                        </Col>
                    )
                })}
            </Row>

            <Row className="mb-3">
                <Col>
                <h5>Quantity</h5>
                </Col>
                {pallets.map((pallet) => {
                    return (
                        <Col>
                        <h5>{pallet.quantity}</h5>
                        
                        </Col>
                    )
                })}
            </Row>

            <Row className="mb-3">
                <Col>
                <h5>Price</h5>
                </Col>
                {pallets.map((pallet) => {
                    return (
                        <Col>
                        <Form.Control type="number"></Form.Control>
                        </Col>
                    )
                })}
            </Row>

            <Row>
                <Col>
                <Button variant="outline-danger" className="w-100">Not Interested</Button>
                </Col>
                <Col>
                <Button variant="success" className="w-100">Send Quotes</Button>
                </Col>
            </Row>


        </Form>



    </>
    
  );
}
