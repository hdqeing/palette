import { Badge, Button, Col, FloatingLabel, Form, Image, Modal, Row, Table, Toast, ToastContainer } from "react-bootstrap";
import type { Route } from "../+types/root";
import type { QueryDetail, QueryPalletItem, QuerySeller } from "../types";
import { Cancel, CheckCircle } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";

const apiUrl = import.meta.env.VITE_API_URL;

export async function clientLoader({ params }: Route.LoaderArgs) {
  const res = await fetch(`${apiUrl}/v1/queries/${params.queryId}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Failed to fetch query: ${res.status}`);

  return await res.json() as QueryDetail;
}

export async function clientAction({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as "accept" | "reject";
  const sellerId = formData.get("sellerId") as string;

  const res = await fetch(`${apiUrl}/v1/queries/${params.queryId}/seller/${sellerId}/${intent}`, {
    method: "PUT",
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Failed to ${intent} quote: ${res.status}`);

  return { ok: true, intent };
}

export default function QueryDetailPage({ loaderData }: Route.ComponentProps) {
    if (!loaderData) return null; // or a proper error/skeleton component

  const query: QueryDetail = loaderData;
  const { t } = useTranslation();
  const fetcher = useFetcher();

  const [showModalAcceptQuote, setShowModalAcceptQuote] = useState(false);
  const [showModalRejectQuote, setShowModalRejectQuote] = useState(false);
  const [showToastAccepted, setShowToastAccepted] = useState(false);
  const [showToastRejected, setShowToastRejected] = useState(false);
  const [selectedSellerId, setSelectedSellerId] = useState(0);

const deadline = query.deadline?.split("T")[0] ?? "";
  const isSubmitting = fetcher.state === "submitting";

  // Show toast after successful action
  useEffect(() => {
    if (!fetcher.data?.ok) return;

    if (fetcher.data.intent === "accept") {
      setShowModalAcceptQuote(false);
      setShowToastAccepted(true);
    }

    if (fetcher.data.intent === "reject") {
      setShowModalRejectQuote(false);
      setShowToastRejected(true);
    }
  }, [fetcher.data]);

  const submitAction = (intent: "accept" | "reject") => {
    fetcher.submit(
      { intent, sellerId: String(selectedSellerId) },
      { method: "POST" }
    );
  };

  return (
    <>
      <div style={{ backgroundColor: "burlywood" }} className="d-flex justify-content-center vw-100">
        <nav aria-label="breadcrumb" className="w-75 p-2">
          <ol className="breadcrumb m-0">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item"><a href="/query">Query</a></li>
            <li className="breadcrumb-item active">{query.id}</li>
          </ol>
        </nav>
      </div>

      <main className="d-flex flex-column align-items-center p-2 gap-2">
        <Form className="w-75 my-4">
          <Row>
            <Col>
              <FloatingLabel controlId="deadlineFloating" label={t("deadline")}>
                <Form.Control type="date" value={deadline} readOnly />
              </FloatingLabel>
            </Col>
            <Col className="d-flex justify-content-end align-items-center">
              <Form.Check type="switch" label={t("close_this_request")} id="close-rfq-switch" />
            </Col>
          </Row>
        </Form>

        <Table className="w-75" bordered>
          <thead>
            <tr>
              <th className="text-center">{t("seller")}</th>
              {query.pallets.map((item: QueryPalletItem) => (
                <th key={item.queryPalletId}>
                  <div className="d-flex gap-2 align-items-center justify-content-center">
                    <Image
                      src={item.pallet.url}
                      className="shadow bg-body-tertiary rounded"
                      style={{ width: "64px", height: "64px", objectFit: "contain" }}
                    />
                    <b>{t(item.pallet.name)} <Badge>{t(item.pallet.quality)}</Badge> <br /> {item.quantity}</b>
                  </div>
                </th>
              ))}
              <th className="text-center">{t("total_price")}</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {query.sellers.map((seller: QuerySeller) => (
              <tr key={seller.sellerId}>
                <td>{seller.sellerTitle}</td>

                {query.pallets.map((item: QueryPalletItem) => {
                  const quote = seller.quotes.find((q) => q.queryPalletId === item.queryPalletId);
                  return (
                    <td key={item.queryPalletId} className="text-center">
                      {quote ? `€ ${quote.price.toFixed(2)}` : "—"}
                    </td>
                  );
                })}

                <td className="text-center">{`€ ${seller.sum}`}</td>

                <td className="w-25 text-center">
                  {seller.accepted ? (
                    <><CheckCircle color="success" className="me-1"></CheckCircle><b>{t("accepted")}</b></>
                  ) : seller.rejected ? (
                    <><Cancel color="error" className="me-1"></Cancel><b>{t("rejected")}</b></>
                  ) : (
                    <div className="d-flex justify-content-evenly">
                      <Button
                        variant="outline-success"
                        disabled={isSubmitting}
                        onClick={() => { setSelectedSellerId(seller.sellerId); setShowModalAcceptQuote(true); }}
                      >
                        <CheckCircle color="success" className="me-1" />{t("accept_quote")}
                      </Button>
                      <Button
                        variant="outline-danger"
                        disabled={isSubmitting}
                        onClick={() => { setSelectedSellerId(seller.sellerId); setShowModalRejectQuote(true); }}
                      >
                        <Cancel color="error" className="me-1" />{t("reject_quote")}
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Reject Modal */}
        <Modal show={showModalRejectQuote} centered size="sm">
          <Modal.Header className="justify-content-center">
            <Cancel className="me-1" color="error" />
            <Modal.Title>{t("reject_quote")}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">{t("message_reject_quote")}</Modal.Body>
          <Modal.Footer>
            <Button className="w-100" variant="outline-success" onClick={() => setShowModalRejectQuote(false)}>{t("cancel")}</Button>
            <Button className="w-100" variant="danger" disabled={isSubmitting} onClick={() => submitAction("reject")}>
              {isSubmitting ? t("loading") : t("reject_quote")}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Accept Modal */}
        <Modal show={showModalAcceptQuote} centered size="sm">
          <Modal.Header className="justify-content-center">
            <CheckCircle className="me-1" color="success" />
            <Modal.Title>{t("accept_quote")}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">{t("message_accept_quote")}</Modal.Body>
          <Modal.Footer>
            <Button className="w-100" variant="outline-danger" onClick={() => setShowModalAcceptQuote(false)}>{t("cancel")}</Button>
            <Button className="w-100" variant="success" disabled={isSubmitting} onClick={() => submitAction("accept")}>
              {isSubmitting ? t("loading") : t("accept_quote")}
            </Button>
          </Modal.Footer>
        </Modal>

        <ToastContainer position="middle-center">
          <Toast delay={3000} autohide bg="success" show={showToastAccepted} onClose={() => setShowToastAccepted(false)}>
            <Toast.Header closeButton={false} className="justify-content-center p-2">
              <h5 className="m-0"><CheckCircle />{t("accept_quote")}</h5>
            </Toast.Header>
            <Toast.Body className="d-flex justify-content-center">
              <h6 className="text-light p-3">{t("toast_quote_accepted")}</h6>
            </Toast.Body>
          </Toast>
        </ToastContainer>

        <ToastContainer position="middle-center">
            <Toast delay={3000} autohide bg="danger" show={showToastRejected} onClose={() => setShowToastRejected(false)}>
              <Toast.Header closeButton={false} className="d-flex justify-content-center">
                  <Cancel color="error" className="me-1"/>{t("reject_quote")}
              </Toast.Header>
              <Toast.Body className="text-center text-white">
                  {t("toast_quote_rejected")}
              </Toast.Body>
            </Toast>
        </ToastContainer>

      </main>
    </>
  );
}