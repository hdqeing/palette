import EgPaletten from '../assets/egPalette.jpg';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../index.css'
import Card from 'react-bootstrap/Card';

function PaletteCard(props) {
    return (
              <Card className="h-100 d-flex flex-row">
                <Card.Img src={category.picture} style={{ width: "200px" }} />
                <Card.Body>
                  <Card.Title>{category.name}</Card.Title>
                  <Form onSubmit={handleAddToCartClick}>
                    <Form.Control type="hidden" name="category" value={category.name} />

                    <FloatingLabel label="Product Name">
                      <Form.Select>
                        {productsInCategory.map((product) => {
                          return (
                            <option>{product.name}</option>
                          )
                        })}

                      </Form.Select>
                    </FloatingLabel>

                    <Button variant="primary" type="submit">
                      Add to shopping cart
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
    )

}

export default PaletteCard;