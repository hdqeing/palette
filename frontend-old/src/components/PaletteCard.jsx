import EgPaletten from '../assets/egPalette.jpg';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../index.css'
import Card from 'react-bootstrap/Card';
import { Alert, FloatingLabel } from 'react-bootstrap';

import { useEffect, useState } from 'react';

function PaletteCard({ id, name, length, width, height, onSubmitPallet }) {

  const [pallets, setPallets] = useState([])
  const [selectedPallet, setSelectedPallet] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:8080/sort/${id}/pallets`)
      .then(response => response.json())
      .then(data => {
        setPallets(data); 
        setSelectedPallet(data[0]);
      })
      .catch(error => console.error("Error fetching pallets:", error))
  }, [id]); // Add this dependency array!
  
  // In your handlePalletSelect function
  const handlePalletSelect = (e) => {
    const selectedId = parseInt(e.target.value, 10);
    const pallet = pallets.find(p => p.id === selectedId);
    setSelectedPallet(pallet);
  }

  const handlePalletSubmit = (e) => {
    e.preventDefault();

    if (!selectedPallet){
      <Alert variant='warning'>
        You have not select a pallet.
      </Alert>
    }
    onSubmitPallet(selectedPallet);

  }


  if (!selectedPallet) {
    return <div>Loading...</div>;
  }

  return (

    <Card className="h-100 d-flex flex-row">
      <div className='d-flex align-items-center'>
        <Card.Img src={selectedPallet.url} style={{ width: 250, height: 150 }} key={selectedPallet.id}></Card.Img>
      </div>

      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Form onSubmit={handlePalletSubmit}>

          <FloatingLabel label="Size" className="mb-3">
            <Form.Select disabled >
              <option value="">{`${length} × ${width} × ${height}`}</option>
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel label="Quality" className="mb-3">
            <Form.Select onChange={handlePalletSelect} >
              {pallets.map((pallet) => {
                return (
                  <option key={pallet.id} value={pallet.id}>{pallet.quality}</option>
                )
              })}
            </Form.Select>
          </FloatingLabel>
          
          <Button type='submit' className="w-100 mb-3">
            Add to Cart
          </Button>

          <Button variant='outline-success' className="w-100">
            Check out sellers with stocks
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )

}

export default PaletteCard;