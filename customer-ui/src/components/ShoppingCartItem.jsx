import { Delete } from "@mui/icons-material";
import { Badge, Button, Col, FormControl, Image, InputGroup, Row } from "react-bootstrap";

function ShoppingCartItem({ url, name, quality, quantity }) {

    return (
        <Row>
            <Col xxl={4}>
                <Image src={url} style={{ width: 100, height: 100 }}></Image>
            </Col>
            <Col xxl={8}>
                <Row>
                    <Col xxl={8}>
                        <p>{name}</p>
                    </Col>
                    <Col xxl={4}>
                        <Badge>{quality}</Badge>
                    </Col>
                </Row>

                <Row>
                    <Col >
                        <Row>
                        <Col xs={8}>
                                                    <InputGroup>
                            <Button>-</Button>
                            <FormControl type="number" placeholder={quantity}></FormControl>
                            <Button>+</Button>
                        </InputGroup>

                        </Col>
                        <Col xs={4} >
                            <Button className="w-100"><Delete></Delete></Button>
                        </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>        
        </Row>
    )

}

export default ShoppingCartItem;