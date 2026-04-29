// routes/seller-detail.tsx
import { Badge, Card, Col, Image, Row, Table } from "react-bootstrap";
import type { Route } from "./+types/seller-detail";
import type { Company, PalletStock } from "../types";
import { CheckCircle, Cancel, Storefront } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const apiUrl = import.meta.env.VITE_API_URL;
const blobBaseUrl = "https://palletly.blob.core.windows.net/pallet-images";

type SellerDetailLoaderData = {
  seller: Company;
  stocks: PalletStock[];
};

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs): Promise<SellerDetailLoaderData> {
  const [sellerRes, stocksRes] = await Promise.all([
    fetch(`${apiUrl}/v1/companies/${params.sellerId}`, {
      credentials: "include",
    }),
    fetch(`${apiUrl}/v1/companies/${params.sellerId}/stocks`, {
      credentials: "include",
    }),
  ]);

  if (!sellerRes.ok) {
    throw new Error(`Failed to fetch seller: ${sellerRes.status}`);
  }

  if (!stocksRes.ok) {
    throw new Error(`Failed to fetch seller stocks: ${stocksRes.status}`);
  }

  return {
    seller: await sellerRes.json(),
    stocks: await stocksRes.json(),
  };
}

function StatusBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <Badge bg={active ? "success" : "secondary"} className="d-flex align-items-center gap-1">
      {active ? (
        <CheckCircle style={{ fontSize: 14 }} />
      ) : (
        <Cancel style={{ fontSize: 14 }} />
      )}
      {label}
    </Badge>
  );
}

export default function SellerDetailPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { seller, stocks } = loaderData;

  return (
    <>
      <div style={{ backgroundColor: "burlywood" }} className="d-flex justify-content-center vw-100">
        <nav aria-label="breadcrumb" className="w-75 p-2">
          <ol className="breadcrumb m-0">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item">
              <a href="/seller">Seller</a>
            </li>
            <li className="breadcrumb-item active">{seller.title}</li>
          </ol>
        </nav>
      </div>

      <main className="d-flex flex-column align-items-center p-2 gap-4">
        <Card className="w-75 shadow-sm my-4">
          <Card.Body>
            <div className="d-flex align-items-center gap-2 mb-3">
              <Storefront color="action" />
              <h3 className="mb-0">{seller.title}</h3>
              {seller.verified && <CheckCircle color="success" />}
            </div>

            <Table borderless size="sm" className="mb-3 w-auto">
              <tbody>
                <tr>
                  <td className="text-muted pe-3">{t("address")}</td>
                  <td>
                    {seller.street} {seller.houseNumber}, {seller.postalCode} {seller.city}
                  </td>
                </tr>
                <tr>
                  <td className="text-muted pe-3">VAT</td>
                  <td>{seller.vat}</td>
                </tr>
                <tr>
                  <td className="text-muted pe-3">{t("homepage")}</td>
                  <td>
                    {seller.homepage ? (
                      <a href={seller.homepage} target="_blank" rel="noreferrer">
                        {seller.homepage}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>

          </Card.Body>
        </Card>

        <div className="w-75 d-flex flex-column gap-3 mb-4">
          <h5 className="mb-0">
            {stocks.length} {t("stocks_available")}
          </h5>

          {stocks.length === 0 ? (
            <p className="text-muted">{t("no_stocks_available")}</p>
          ) : (
            stocks.map((stock) => (
              <Card key={stock.id} className="shadow-sm">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={2}>
                      <Image
                        src={stock.pallet.url}
                        style={{ width: 96, height: 96, objectFit: "contain" }}
                        className="shadow rounded bg-body-tertiary p-2"
                      />
                    </Col>

                    <Col md={4}>
                      <h6 className="fw-bold mb-1">
                        {t(stock.pallet.name)}{" "}
                        <Badge bg={stock.pallet.quality === "new" ? "success" : "warning"}>
                          {t(stock.pallet.quality)}
                        </Badge>
                      </h6>
                      <p className="text-muted small mb-0">
                        {stock.pallet.length} × {stock.pallet.width} × {stock.pallet.height} mm
                      </p>
                      <p className="text-muted small mb-0">
                        {t("weight")}: {stock.pallet.weight} kg
                      </p>
                    </Col>

                    <Col md={2} className="text-center border-start border-end">
                      <p className="text-muted small mb-0">{t("price_per_unit")}</p>
                      <h5 className="fw-bold text-success mb-0">€ {stock.price.toFixed(2)}</h5>
                      <p className="text-muted small mt-2 mb-0">{t("quantity")}</p>
                      <b>{stock.quantity.toLocaleString()}</b>
                    </Col>

                    <Col md={4}>
                      {stock.photos?.length > 0 ? (
                        <div className="d-flex gap-2 flex-wrap justify-content-end">
                          {stock.photos.slice(0, 4).map((photo) => (
                            <Image
                              key={photo.id}
                              src={`${blobBaseUrl}/${photo.blobName}`}
                              style={{
                                width: 72,
                                height: 72,
                                objectFit: "contain",
                                borderRadius: 8,
                              }}
                              className="shadow-sm"
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted small text-end mb-0">{t("no_photos")}</p>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      </main>
    </>
  );
}