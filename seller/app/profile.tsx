import { useEffect, useState } from "react";
import { Accordion, Breadcrumb, Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import type { User } from "./types/user";
import type { Company } from "./types/company";
import VerifiedIcon from '@mui/icons-material/Verified';
import AddIcon from '@mui/icons-material/Add'

export default function ProfilePage(){
    const [user, setUser] = useState<User | null>(null)
    const [company, setCompany] = useState<Company | null>(null)
    const API_URL = import.meta.env.VITE_API_URL;

    const getUserFromServer = async () => {
      try {
        const response = await fetch(`${API_URL}/v1/auth/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Include cookies for JWT token
        });
    
        if (response.status === 200) {
          const userData = await response.json();
          console.log('Employee data retrieved:', userData);
          setUser(userData)
          setCompany(userData.company)
        } else if (response.status === 401) {
          // Employee not authenticated or token expired/invalid
          console.log('Employee not authenticated - invalid or expired token');
        } else if (response.status === 403) {
          // Employee's company not authorized as seller
          console.log('Access denied - company not authorized as seller');
        } else if (response.status === 404) {
          // Employee not found
          console.log('Employee not found');
        } else {
          console.error('Error fetching employee data:', response.status);
        }
      } catch (error) {
        console.error('Network error while fetching employee:', error);
      }
    };


    // Inside your component
    useEffect(() => {
      // This runs every time the page loads/refreshes
      console.log('Page loaded - checking authentication');
      getUserFromServer();
    }, []); // Empty dependency array means it runs once on mount
    

    return (
        <>
            <Breadcrumb className="m-3">
                <Breadcrumb.Item>Palletly</Breadcrumb.Item>
                <Breadcrumb.Item active>Profile</Breadcrumb.Item>
            </Breadcrumb>
            
            <Accordion defaultActiveKey={["p", "c"]} alwaysOpen className="m-3">
                <Accordion.Item eventKey="p">
                    <Accordion.Header>Profile</Accordion.Header>
                    <Accordion.Body>
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formUserEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control type="email" placeholder={user?.email} disabled plaintext/>
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group className="mb-3" controlId="formUserLanguage">
                                        <Form.Label>Preferred Language</Form.Label>
                                        <Form.Select>
                                            <option value="de">German</option>
                                            <option value="en">English</option>
                                            <option value="ru">Russian</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formUserLastname">
                                        <Form.Label>Lastname</Form.Label>
                                        <Form.Control type="text" placeholder={user?.lastName}/>
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group className="mb-3" controlId="formUserFirstname">
                                        <Form.Label>Firstname</Form.Label>
                                        <Form.Control type="text" placeholder={user?.firstName}/>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col></Col>
                                <Col>
                                    <Button variant="success" type="submit" className="w-100">
                                        Save
                                    </Button>
                                </Col>
                            </Row>

                        </Form>


                    </Accordion.Body>

                </Accordion.Item>
                <Accordion.Item eventKey="c">
                    <Accordion.Header>Company</Accordion.Header>
                    <Accordion.Body>
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formCompanyTitle">
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control type="text" placeholder={company?.title} />
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group className="mb-3" controlId="formCompanyVAT">
                                        <Form.Label>VAT</Form.Label>
                                            <InputGroup className="mb-3">
                                                <Form.Control placeholder={company?.vat} />
                                                <Button variant="link">
                                                    <VerifiedIcon color="success"></VerifiedIcon>
                                                </Button>
                                            </InputGroup>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formUserLastname">
                                        <Form.Label>Address</Form.Label>
                                        <Row className="mb-1">
                                            <Col xxl={10}>
                                            <Form.Control placeholder={company?.street} />
                                            </Col>
                                            <Col xxl={2}>
                                            <Form.Control placeholder={company?.houseNumber} />
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col>
                                            <Form.Control placeholder={company?.postalCode} />
                                            </Col>
                                            <Col>
                                            <Form.Control placeholder={company?.city} />
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group className="mb-3" controlId="formCompanyHomepage">
                                        <Form.Label>Homepage</Form.Label>
                                        <Form.Control type="text" placeholder={company?.homepage}/>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col></Col>
                                <Col>
                                    <Button variant="success" type="submit" className="w-100">
                                        Save
                                    </Button>
                                </Col>
                            </Row>

                        </Form>

                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </>

    )
}
