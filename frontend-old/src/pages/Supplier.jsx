import { useState } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing


export default function Supplier() {
  // Array of suppliers with countries
  const suppliers = [
    { id: 1, name: "Lieferant 1", country: "Germany" },
    { id: 2, name: "Lieferant 2", country: "France" },
    { id: 3, name: "Lieferant 3", country: "Germany" },
    { id: 4, name: "Lieferant 4", country: "Italy" },
  ];

  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("All");

  const navigate = useNavigate();
  
  // Handle checkbox change
  const handleCheckboxChange = (e, supplierId) => {
    if (e.target.checked) {
      setSelectedSuppliers([...selectedSuppliers, supplierId]);
    } else {
      setSelectedSuppliers(selectedSuppliers.filter(id => id !== supplierId));
    }
  };

  // Handle sending the query to selected suppliers
  const handleSendQuery = () => {
    navigate("/query");
  };

  // Handle country filter change
  const handleCountryFilterChange = (e) => {
    setSelectedCountry(e.target.value);
  };

  // Filter suppliers based on selected country
  const filteredSuppliers = selectedCountry === "All" 
    ? suppliers 
    : suppliers.filter(supplier => supplier.country === selectedCountry);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <div style={{ width: '50%', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        {/* Country filter dropdown */}
        <Form.Group controlId="countryFilter" className="mb-3">
          <Form.Label>Filter by Country</Form.Label>
          <Form.Control as="select" value={selectedCountry} onChange={handleCountryFilterChange}>
            <option value="All">All</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Italy">Italy</option>
          </Form.Control>
        </Form.Group>

        {/* Render filtered suppliers */}
        {filteredSuppliers.map((supplier) => (
          <Row key={supplier.id} className="mb-3">
            <Col>
              {supplier.name} ({supplier.country})
            </Col>
            <Col className="d-flex justify-content-end">
              <Form.Check
                type="checkbox"
                label="Select"
                onChange={(e) => handleCheckboxChange(e, supplier.id)}
              />
            </Col>
          </Row>
        ))}
        
        {/* Send price inquiry button */}
        <Button variant="primary" className="mt-3" onClick={handleSendQuery}>
          Send Price Inquiry
        </Button>

        <p className="mt-3">
          Ihre Preisabfrage wurde geschickt, bei 
          <Link to="/order">Bestellung</Link>
          bekommen Sie Neuigkeiten von Ihrer Preisabfrage.
        </p>
      </div>
    </div>
  );
}
