import { CheckCircle, RequestQuoteOutlined, Verified, Warning } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Alert, Breadcrumb, Button, Col, FloatingLabel, Form, ListGroup, Modal, Row, Tab, Tabs } from "react-bootstrap";
import { useAppContext } from "~/layouts/layout";
import type { CartEntity, Company } from "~/types";
import Badge from 'react-bootstrap/Badge';
import { useTranslation } from "react-i18next";


export default function Seller() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const { t } = useTranslation();
  const [allSellers, setAllSellers] = useState<Company[]>([]);
  const [selectedSellers, setSelectedSellers] = useState<Company[]>([]);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [authenticated, setAuthenticated, paletteInCart, setPaletteInCart] = useAppContext();
  const [showRequestQuoteConfirm, setShowRequestQuoteConfirm] = useState(false)
  const [activeKey, setActiveKey] = useState("deadline");
  const [newRequestQuoteId, setNewRequestQuoteId] = useState(0);
  const [showRfQFailedAlert, setShowRfQFailedAlert] = useState(false);
  const [deliveryRequest, setDeliveryRequest] = useState(false);
  const [deadline, setDeadline] = useState("");


  const getSellers = async () => {
    const response = await fetch(`${apiUrl}/v1/companies/sellers`, {
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      setAllSellers(data);
    }
  };

  const handleSubmitRequestQuote = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/v1/queries`,
        {
          credentials: "include",
          method: "POST",
          headers: {accept: "*/*", "Content-Type": "application/json"},
          body: JSON.stringify({
            sellers: selectedSellers.map(seller => seller.id),
            itemQuantities: paletteInCart.map(item => ({itemId: item.pallet?.id, quantity: item.quantity})),
            deadline: new Date(deadline).toISOString(),
            deliveryRequest: deliveryRequest
          })
        }
      );

      if (response.ok) {
        setActiveKey("success");
        const data = await response.json();
        setNewRequestQuoteId(data.id);
      }

    } catch (error) {
      console.log(error);
    }
  }

  const handleSelectAll = () => {
    if (onlyVerified) {
      setSelectedSellers(allSellers.filter((i) => i.verified));
    } else {
      setSelectedSellers(allSellers);
    }
  };

  useEffect(() => {
    getSellers();
  }, []);

  return (
    <>
      <div
        style={{ backgroundColor: "burlywood" }}
        className="d-flex justify-content-center vw-100"
      >
        <nav aria-label="breadcrumb" className="w-75 py-2">
          <ol className="breadcrumb m-0">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Seller
            </li>
          </ol>
        </nav>
      </div>

      <main className="d-flex flex-column align-items-center p-2 gap-2">
        <div className="w-75">
          <Row>
            <Col className="p-0">
              <Button variant="outline-success" onClick={handleSelectAll}>
                Select All
              </Button>
            </Col>
            <Col>
              <Form.Check
                type="checkbox"
                label="Only Verified"
                checked={onlyVerified}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setOnlyVerified(checked);

                  // remove unverified sellers if checkbox is turned on
                  if (checked) {
                    setSelectedSellers((prev) =>
                      prev.filter((s) => s.verified),
                    );
                  }
                }}
              />
            </Col>
            <Col>
              <Form.Check
                type="checkbox"
                label="Only Sellers with Stocks"
              ></Form.Check>
            </Col>
            <Col className="d-flex justify-content-end p-0">
              <Button
                className="d-flex justify-content-center align-items-center gap-1 p-2"
                variant="success"
                onClick={() => setShowRequestQuoteConfirm(true)}
              >
                <RequestQuoteOutlined></RequestQuoteOutlined>
                <p className="m-0">Request Quote</p>
              </Button>
            </Col>
          </Row>
        </div>

        <div className="w-75">
          <Form>
            {allSellers.map((seller: Company) => (
              <Row
                key={seller.id}
                className="shadow p-3 mb-3 bg-success-subtle rounded"
              >
                <Col xxl="2" className="d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    checked={selectedSellers.some((s) => s.id === seller.id)}
                    disabled={onlyVerified && !seller.verified}
                    onChange={(e) => {
                      const checked = e.target.checked;

                      if (checked) {
                        setSelectedSellers((prev) =>
                          prev.some((s) => s.id === seller.id)
                            ? prev
                            : [...prev, seller],
                        );
                      } else {
                        setSelectedSellers((prev) =>
                          prev.filter((s) => s.id !== seller.id),
                        );
                      }
                    }}
                  />
                </Col>

                <Col xxl="5" className="d-flex align-items-center gap-1">
                  <Verified
                    color={seller.verified ? "success" : "action"}
                  ></Verified>
                  <a href={`/seller/${seller.id}`}><h3 className="m-0">{seller.title}</h3></a>
                </Col>

                <Col xxl="5" className="d-flex">
                  <h5 className="m-0">
                    {seller.street} {seller.houseNumber}
                    <br />
                    {seller.postalCode}, {seller.city}
                  </h5>
                </Col>
              </Row>
            ))}
          </Form>
        </div>

        <Modal show={showRequestQuoteConfirm} size="lg" centered>
          <Modal.Header className="justify-content-center">
            <Modal.Title><RequestQuoteOutlined></RequestQuoteOutlined>{t("request_for_quote")}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Tab.Container activeKey={activeKey}>
              <Tab.Content>

                <Tab.Pane eventKey="deadline">
                  <div>
                    <Form className="d-flex flex-column gap-2">
                      <div>
                        <Form.Check type="radio" name="RfQType" label="I will pick up the pallets." checked={!deliveryRequest} onChange={() => setDeliveryRequest(false)}></Form.Check>
                        <Form.Check type="radio" name="RfQType" label="The pallets should be delivered." checked={deliveryRequest} onChange={() => setDeliveryRequest(true)}></Form.Check>
                      </div>
                      <FloatingLabel controlId="floatingDeadline" label="Deadline">
                        <Form.Control type="date" value={deadline} onChange={e => setDeadline(e.target.value)}/>
                      </FloatingLabel>

                    </Form>
                  </div>
                </Tab.Pane>


                <Tab.Pane eventKey="detail">
                  <div className="d-flex flex-column px-2">
                    <Row className="m-0">
                        <ListGroup className="p-0">
                          <ListGroup.Item className="d-flex">
                            <Col><b>{t("pallet")}</b></Col>
                            <Col><b>{t("quality")}</b></Col>
                            <Col><b>{t("quantity")}</b></Col>
                          </ListGroup.Item>

                          {paletteInCart.map((entity: CartEntity) => (
                            <ListGroup.Item className="d-flex" key={entity.pallet?.id}>
                              <Col>{t(entity.pallet?.name)}</Col>
                              <Col><Badge>{t(entity.pallet?.quality)}</Badge></Col>
                              <Col>{entity.quantity}</Col>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                    </Row>

                    <hr />

                    <Row className="m-0">
                        <ListGroup className="p-0">
                          <ListGroup.Item><b>Seller</b></ListGroup.Item>

                          {selectedSellers.map((seller: Company) => (
                            <ListGroup.Item key={seller.id}>
                              <Verified color={seller.verified? "disabled" : "success"}></Verified>{seller.title}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                    </Row>
                    
                    <Alert variant="danger" className="d-flex gap-1" show={showRfQFailedAlert}>
                      <Warning color="error"></Warning><b>{t("message_rfq_failed")}</b>
                    </Alert>
                  </div>
                </Tab.Pane>

                <Tab.Pane eventKey="success">
                  <div className="p-4">
                    <CheckCircle color="success" className="me-1"></CheckCircle>
                    <b>{t("message_rfq_success")}</b>
                  </div>
                </Tab.Pane>

              </Tab.Content>
            </Tab.Container>
          </Modal.Body>

          <Modal.Footer>
            {
              activeKey === "deadline"? (
              <Row className="w-100">
                <Col><Button className="w-100" variant="outline-danger" onClick={()=>{setShowRequestQuoteConfirm(false)}}>{t("cancel")}</Button></Col>
                <Col className="d-flex justify-content-end"><Button className="w-100" variant="success" onClick={() => setActiveKey("detail")}>{t("next")}</Button></Col>
              </Row>

              ) : activeKey === "detail"? (
              <Row className="w-100">
                <Col><Button className="w-100" variant="outline-danger" onClick={()=>{setShowRequestQuoteConfirm(false)}}>{t("cancel")}</Button></Col>
                <Col className="d-flex justify-content-end"><Button className="w-100" variant="success" onClick={handleSubmitRequestQuote}>{t("send_request_for_quote")}</Button></Col>
              </Row>
            ) : (
              <Row className="w-100">
                <Col><Button className="w-50" variant="outline-danger" onClick={()=>{setShowRequestQuoteConfirm(false)}}>{t("stay_on_this_page")}</Button></Col>
                <Col className="d-flex justify-content-end"><Button className="w-50" variant="success" href={`/query/${newRequestQuoteId}`}>{t("check_details")}</Button></Col>
              </Row>
            )

              
            }

          </Modal.Footer>
        </Modal>
      </main>
    </>
  );
}
