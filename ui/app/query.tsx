import { useState, useEffect } from "react";
import { Accordion, Table, Button, Form, Alert, Spinner, Row, Breadcrumb, Container } from "react-bootstrap";
import { useOutletContext } from "react-router";
import type { Query, QuerySeller } from "./types/query";
import { Link } from "react-router";

export default function SellerQuery() {
  const [queries, setQueries] = useState<Query []>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sellerPrices, setSellerPrices] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;
  const authenticated = useOutletContext();

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
        setLoading(false);
      }
    };

    // Reset states when authentication changes
    setLoading(true);
    setError(null);
    setQueries([]);

    if (authenticated) {
      console.log("User is authenticated, fetching queries...");
      fetchQueries();
    } else {
      console.log("User is not authenticated, skipping fetch");
      setLoading(false);
    }
  }, [authenticated, API_URL]); // Add authenticated as dependency



  async function logFormData(formData) {
    const queryId = formData.get("queryId")
    const prices = {}
    for (const pair of formData.entries()){
      if (pair[0] != "queryId") {
        prices[pair[0]] = pair[1]
      }
    }
    try {
      const response = await fetch(`${API_URL}/${queryId}/prices`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prices:prices }),
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

      const data = await response.json();
      console.log(JSON.stringify(data));
    } catch (err) {
      console.log(err.message)
    } finally {
      setLoading(false);
    }

  }

  // Show authentication required message if not authenticated
  if (!authenticated) {
    return (
      <div className="container mt-4">
        <Alert variant="warning">
          <Alert.Heading>Authentication Required</Alert.Heading>
          <p>Please log in to view and respond to price inquiries.</p>
          <hr />
          <p className="mb-0">
            Use the Login button in the top navigation to access your account.
          </p>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading queries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">
          Error loading queries: {error}
        </Alert>
      </div>
    );
  }

  if (queries.length === 0) {
    return (
      <div className="container mt-4">
        <h2>Price Inquiries</h2>
        <Alert variant="info">
          No queries received yet.
        </Alert>
      </div>
    );
  }

  return (
    <>
  <Breadcrumb className="m-3">
    <Breadcrumb.Item>Palletly</Breadcrumb.Item>
    <Breadcrumb.Item active>Preisabfrage</Breadcrumb.Item>
  </Breadcrumb>

<Container className="m-3 p-0">

  <Table bordered size="sm">
    <thead>
      <tr>
        <th>ID</th>
        <th>Customer</th>
        <th>Deadline</th>
        <th>State</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {queries.map((query) => (
        <tr key={query.id}>
          <td>{query.id}</td>
          <td>{query.buyer.title}</td>
          <td>{query.deadline}</td>
          <td>{query.isClosed}</td>
          <td><Link to={`/query/${query.id}`}>Detail</Link></td>
        </tr>
      ))}
    </tbody>
  </Table>
</Container>
    
    </>
  );
}