import { Verified } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";


export default function Seller() {
    const [sellers, setSellers] = useState([]);
    const [onlyVerified, setOnlyVerified] = useState(false);
    const [allSelected, setAllSelected] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState([]);
      const apiUrl = import.meta.env.VITE_API_URL;


    const getSellers = async () => {
        try {
            const response = await fetch(`${apiUrl}/v1/companies/sellers`);
            
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`)
            }

            const result = await response.json();
            console.log(result);
            setSellers(result);

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getSellers();
    },[])


    return (
        <Container>
            <Form>
                <Form.Check type="checkbox" label="Select All" checked></Form.Check>
                <Form.Check type="checkbox" label="Only verified sellers" checked></Form.Check>
            {sellers.map((seller) => {
                return(
                    <Row key={seller.id} className="bg-secondary bg-opacity-50 border border-light rounded mt-3" hidden={onlyVerified && !seller.verified}>
                        <Col>
                            <span>{seller.title}</span><Verified color={seller.verified ? "success" : "disabled"}></Verified>
                            <p>{seller.street}, {seller.houseNumber}</p>
                            <p>{seller.postalCode}, {seller.city}</p>
                        </Col>
                        <Col className="d-flex align-items-center">
                            <Form.Check type="checkbox" id={seller.id} checked></Form.Check>
                        </Col>
                    </Row>
                );
                
            })}

            </Form>
        </Container>
    )
}