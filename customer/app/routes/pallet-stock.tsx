// routes/pallet-stock.tsx
import { Badge, Breadcrumb, Card, Col, Image, Row, Table } from "react-bootstrap";
import type { Route } from "./+types/pallet-stock";
import type { PalletStock } from "../types";
import { useTranslation } from "react-i18next";
import {
  CheckCircle,
  Cancel,
  LocalShipping,
  Storefront,
  Public,
  Flag,
} from "@mui/icons-material";

const apiUrl = import.meta.env.VITE_API_URL;
const blobBaseUrl = "https://palletly.blob.core.windows.net/pallet-images";

export async function clientLoader({
  params,
}: Route.ClientLoaderArgs): Promise<PalletStock[]> {
  const res = await fetch(`${apiUrl}/v1/stocks/pallet/${params.palletId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch stocks: ${res.status}`);
  }

  return await res.json();
}


export default function PalletStocksPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
    const stocks = loaderData;

  if (!loaderData || stocks.length === 0) {
    return (
      <>
        <Breadcrumb />
        <main className="d-flex flex-column align-items-center p-2">
          <p className="text-muted mt-5">{t("no_stocks_available")}</p>
        </main>
      </>
    );
  }

  const pallet = stocks[0].pallet;

  return (
    <>
      {/* Breadcrumb */}
      <div
        style={{ backgroundColor: "burlywood" }}
        className="d-flex justify-content-center vw-100"
      >
        <nav aria-label="breadcrumb" className="w-75 p-2">
          <ol className="breadcrumb m-0">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item">
              <a href="/">Pallet</a>
            </li>
            <li className="breadcrumb-item">
              <a href="/">{t(pallet.name)}</a>
            </li>
            <li className="breadcrumb-item active">Stock</li>
          </ol>
        </nav>
      </div>

      <main className="d-flex flex-column align-items-center p-2 gap-4">
        {/* Pallet header */}
        <Row className="w-75 my-4 align-items-center">
          <Col xs="auto">
            <Image
              src={pallet.url}
              style={{ width: 120, height: 120, objectFit: "contain" }}
              className="shadow rounded bg-body-tertiary p-2"
            />
          </Col>
          <Col>
            <h3 className="mb-1">
              {t(pallet.name)}{" "}
              <Badge bg={pallet.quality === "new" ? "success" : "warning"}>
                {t(pallet.quality)}
              </Badge>
            </h3>
            <Table borderless size="sm" className="mb-0 w-auto">
              <tbody>
                <tr>
                  <td className="text-muted pe-3">{t("dimensions")}</td>
                  <td>
                    {pallet.length} × {pallet.width} × {pallet.height} mm
                  </td>
                </tr>
                <tr>
                  <td className="text-muted pe-3">{t("weight")}</td>
                  <td>{pallet.weight} kg</td>
                </tr>
                <tr>
                  <td className="text-muted pe-3">{t("safe_working_load")}</td>
                  <td>{pallet.safeWorkingLoad} kg</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* Stock listings */}
        <div className="w-75 d-flex flex-column gap-3 mb-4">
          <h5 className="mb-0">
            {stocks.length} {t("sellers_available")}
          </h5>

          {stocks.map((stock: PalletStock) => (
            <Card key={stock.id} className="shadow-sm">
              <Card.Body>
                <Row className="align-items-start">
                  {/* Company info */}
                  <Col md={4}>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <Storefront color="action" />
                      <h6 className="mb-0 fw-bold">{stock.company.title}</h6>
                      {stock.company.verified && (
                        <CheckCircle color="success" style={{ fontSize: 18 }} />
                      )}
                    </div>
                    <p className="text-muted small mb-2">
                      {stock.company.street} {stock.company.houseNumber},{" "}
                      {stock.company.postalCode} {stock.company.city}
                    </p>
                    {stock.company.homepage && (
                      <a
                        href={stock.company.homepage}
                        target="_blank"
                        rel="noreferrer"
                        className="small"
                      >
                        {stock.company.homepage}
                      </a>
                    )}

                  </Col>

                  {/* Price & quantity */}
                  <Col
                    md={3}
                    className="d-flex flex-column align-items-center justify-content-center border-start border-end"
                  >
                    <p className="text-muted small mb-0">{t("price_per_unit")}</p>
                    <h3 className="fw-bold text-success mb-0">
                      € {stock.price.toFixed(2)}
                    </h3>
                    <p className="text-muted small mt-2 mb-0">{t("quantity")}</p>
                    <h5 className="mb-0">{stock.quantity.toLocaleString()}</h5>
                  </Col>

                  {/* Photos */}
                  <Col md={5}>
                    {stock.photos.length > 0 ? (
                      <div className="d-flex gap-2 flex-wrap justify-content-end">
                        {stock.photos.slice(0, 4).map((photo) => (
                          <Image
                            key={photo.id}
                            src={`${blobBaseUrl}/${photo.blobName}`}
                            style={{
                              width: 80,
                              height: 80,
                              objectFit: "contain",
                              borderRadius: 8,
                            }}
                            className="shadow-sm"
                          />
                        ))}
                        {stock.photos.length > 4 && (
                          <div
                            style={{ width: 80, height: 80, borderRadius: 8 }}
                            className="bg-secondary d-flex align-items-center justify-content-center text-white fw-bold"
                          >
                            +{stock.photos.length - 4}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted small text-end mb-0">
                        {t("no_photos")}
                      </p>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}