import { useState, useEffect } from "react";
import { Button, Modal, Form, FloatingLabel, Row, Col, Alert, Spinner, Breadcrumb, BreadcrumbItem, Container, Card } from "react-bootstrap";
import { useOutletContext } from "react-router";
import type { Query, QuerySeller } from "../types/query";

const SellerHome = () => {
  const [queries, setQueries] = useState<Query []>([]);
  const authenticated = useOutletContext();
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch queries from API
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await fetch(`${API_URL}/v1/seller/queries`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // This sends cookies with the request
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication required. Please login again.');
          } else if (response.status === 403) {
            throw new Error('Access denied. Your company is not authorized as a seller.');
          } else if (response.status === 404) {
            throw new Error('Employee not found.');
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        const data: QuerySeller[] = await response.json();
        console.log("Getting queries")
        console.log(JSON.stringify(data));
        setQueries(data.map(qs => qs.query));
      } catch (err) {
    console.log(err.message)
      } finally {
      }
    };

    setQueries([]);

    if (authenticated) {
      console.log("User is authenticated, fetching queries...");
      fetchQueries();
    } else {
      console.log("User is not authenticated, skipping fetch");
    }
  }, [authenticated]); // Add authenticated as dependency






  return (
    <>
      <Breadcrumb className="p-3">
        <BreadcrumbItem>Palletly</BreadcrumbItem>
        <BreadcrumbItem active>Dashboard</BreadcrumbItem>
      </Breadcrumb>

      <Container className="p-3" fluid>

        <Row className="shadow-xl/20 mb-3">
          <Col>
          
          <Row>
            <Col><h3>Received Query</h3></Col>
            <Col className="flex justify-end"><a href="http://">view all</a></Col>
          </Row>
          {(authenticated)? <Row>
            {/* {queries.map((query) => (<p>{query.buyer.title}</p>))}  */}
          </Row> : <Row><p>Not authenticated</p></Row>}

          </Col>
        </Row>

        <Row className="shadow-xl/20">
          <Col>
          <Row>
            <Col><h3>My Products</h3></Col>
            <Col className="flex justify-end"><a href="http://">view all</a></Col>
          </Row>

          </Col>
        </Row>

      </Container>

    </>
  );
};

export default SellerHome;