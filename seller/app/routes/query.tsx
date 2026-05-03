import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Image from "react-bootstrap/Image";
import { Breadcrumb, Col, FloatingLabel, Row } from "react-bootstrap";
import { Cancel, Check, Help } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import type { Query, QueryItem } from "~/type";

export default function SellerQueriesPage() {
  const { t } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL;

  const [queries, setQueries] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<Record<number, Record<number, string>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQueries() {
      try {
        const res = await fetch(`${API_URL}/v1/seller/queries`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error(`Request failed: ${res.status}`);

        const data = await res.json();
        setQueries(data);
      } catch (err: any) {
        setError(err.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    loadQueries();
  }, []);

  function handleQuoteChange(
    queryId: number,
    palletId: number,
    value: string
  ) {
    setQuotes((prev) => ({
      ...prev,
      [queryId]: {
        ...prev[queryId],
        [palletId]: value,
      },
    }));
  }

function getTotalPrice(query: Query) {
  return (
    query.pallets?.reduce((sum, pallet) => {
      const price = Number(
        quotes[query.queryId]?.[pallet.pallet.id] ?? "0"
      );

      return sum + pallet.quantity * price;
    }, 0) ?? 0
  );
}

  async function handleSubmitQuote(queryId: number) {

    const payload = {
      quotes: Object.entries(quotes[queryId]).map(([palletId, price]) => ({
        palletId: palletId,
        price: price,
      })),
    };

    try {
      const res = await fetch(
        `${API_URL}/v1/query/${queryId}/quotes`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error(`Quote failed: ${res.status}`);

      alert("Quote submitted successfully");
    } catch (err: any) {
      alert(err.message ?? "Failed to submit quote");
    }
  }

  if (loading) {
    return (
      <div className="p-4">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>{t("request_for_quote")}</Breadcrumb.Item>
      </Breadcrumb>

      <Accordion defaultActiveKey={queries.map(query => String(query.queryId))} alwaysOpen>
        {queries.map((query: Query) => {

          return (
            <Accordion.Item eventKey={String(query.queryId)} key={query.queryId}>
              <Accordion.Header>
                <div className="d-flex gap-2 align-items-center">
                  {query.accepted? (<Check color="success"></Check>) : query.rejected? (<Cancel color="error"></Cancel>) : (<Help color="warning"></Help>)}

                  <div className="d-flex flex-column">
                      <strong>{query.buyer?.title ?? "Unknown buyer"}</strong>
                      <span>
                      {query.buyer
                        ? `${query.buyer.postalCode} ${query.buyer.city}`
                        : ""}
                      </span>
                  </div>

                  <div className="d-flex gap-1">
                    {query.buyer.verified? (<Badge bg="success">{t("verified_customer")}</Badge>) : (<></>)}
                    {query.deliveryRequest? (<Badge bg="warning">{t("delivery_requested")}</Badge>) : (<></>)}
                  </div>
                </div>
              </Accordion.Header>

              <Accordion.Body>
                <Form onSubmit={() => handleSubmitQuote(query.queryId)}>
                <Table bordered>
                  <thead>
                    <tr>
                      <th></th>
                      <th className="text-center">{t("pallet")}</th>
                      <th className="text-center">{t("quality")}</th>
                      <th className="text-center">{t("quantity")}</th>
                      <th className="text-center">{t("price_per_unit")}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {query.pallets?.map((item: QueryItem) => (
                      <tr key={item.queryPalletId}>
                        <td style={{ width: 80 }}>
                          <Image
                            src={item.pallet?.url}
                            alt={item.pallet?.name}
                            thumbnail
                            style={{
                              width: 64,
                              height: 64,
                              objectFit: "contain",
                            }}
                          />
                        </td>

                        <td className="text-center align-middle">{t(item.pallet?.name) ?? "Unknown"}</td>
                        <td className="text-center align-middle"><Badge>{t(item.pallet?.quality) ?? "N/A"}</Badge></td>
                        <td className="text-center align-middle">{item.quantity}</td>

                        <td>
                          {item.quotedPrice !== null ? (
                            `${item.quotedPrice} €`
                          ) : (
                            <Form.Control
                              required
                              type="number"
                              min="0"
                              step="0.01"
                              value={
                                quotes[query.queryId]?.[item.pallet.id] ?? ""
                              }
                              onChange={(e) =>
                                handleQuoteChange(
                                  query.queryId,
                                  item.pallet.id,
                                  e.target.value
                                )
                              }
                              placeholder="Enter price"
                              disabled={query.isClosed}
                            />
                          )}
                        </td>
                      </tr>
                    ))}

                    <tr>
                      <td colSpan={4}><strong>{t("total_price")}</strong></td>
                      <td>{getTotalPrice(query)}</td>
                    </tr>

                  </tbody>
                </Table>

                <Row>
                  <Col xxl={6}>
                    <FloatingLabel
                      controlId="floatingDeadline"
                      label="Deadline"
                    >
                      <Form.Control
                        readOnly
                        value={new Date(query.deadline).toLocaleDateString()}
                      />
                    </FloatingLabel>
                  </Col>
                  {query.isClosed? (
                    <Col xxl={6}>
                      <Alert variant="danger">This Request for Quote has been closed.</Alert>
                    </Col>
                  ) : !query.isClosed && query.sum !== 0? (
                    <Col xxl={6}>
                      <Alert variant="warning">Thanks for quoting, we will inform you as soon as buyer react to your quotes.</Alert>
                    </Col>
                  ) : (
                    <>
                    <Col xxl={3}>
                  <Button
                    className="h-100 w-100"
                    variant="outline-danger"
                  >
                    Ignore Request
                  </Button>

                    </Col>
                    <Col xxl={3}>
                  <Button
                    className="h-100 w-100"
                    variant="success"
                    
                    type="submit"
                  >
                    Submit quote
                  </Button>

                    </Col>
                    
                    </>

                  )}

                  


                </Row>

                </Form>
              </Accordion.Body>

            </Accordion.Item>
          );
        })}
      </Accordion>
    </div>
  );
}