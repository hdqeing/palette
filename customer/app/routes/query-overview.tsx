import { Badge, Container, Table, Alert, Row, Col, Image, ListGroup } from "react-bootstrap";
import type { Route } from "../+types/root";
import type { QueryDetail, QueryCompany } from "../types";
import { Verified } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

type QueryListItem = Omit<QueryDetail, "buyer"> & { sellers: QueryCompany[] };

const apiUrl=import.meta.env.VITE_API_URL;


export async function clientLoader() {
  const res = await fetch(`${apiUrl}/v1/buyer/queries`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch queries: ${res.status}`);
  }

  const queries: QueryListItem[] = await res.json();
  return { queries };
}

export default function QueriesPage({ loaderData }: Route.ComponentProps) {
  if (!loaderData) {
    return <Alert variant="info">Loading...</Alert>;
  }

  const { queries } = loaderData;
  const { t } = useTranslation();


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
              Query
            </li>
          </ol>
        </nav>
      </div>

      <main className="d-flex justify-content-center">
        <div className="py-4 w-75">
          {queries.length === 0 ? (
            <Alert variant="info">No queries found.</Alert>
          ) : (
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th className="text-center">Pallets</th>
                  <th className="text-center">Sellers</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Deadline</th>
                  <th className="text-center">Detail</th>
                </tr>
              </thead>

              <tbody>
                {queries.map((query) => (
                  <tr key={query.id}>

                    <td className="align-middle">
                      <div className="d-flex flex-column gap-2">
                        {query.pallets.map((item) => (
                          <Row>
                            <Col><p>{t(item.pallet.name)}</p></Col>
                            <Col><Badge>{t(item.pallet.quality)}</Badge></Col>
                            <Col>{item.quantity}</Col>
                          </Row>
                        ))}
                      </div>
                    </td>

                    <td className="align-middle">
                      {query.sellers.length === 0 ? (
                        <span className="text-muted fst-italic small">
                          No sellers selected
                        </span>
                      ) : (
                          <ol className="m-0">
                          {query.sellers.map((seller) => (
                            <li>
                                <Verified color={seller.verified? "success" : "disabled"}></Verified>{seller.title}
                            </li>
                          ))}
                          </ol>
                      )}
                    </td>

                    <td className="align-middle text-center">
                      {
                        query.isClosed === true ? (
                          <Badge bg="danger">Closed</Badge>
                        ) : (
                          <Badge bg="success">Open</Badge>
                        )
                      }
                    </td>

                    <td className="align-middle text-center">
                      {query.deadline
                        ? new Date(query.deadline).toLocaleDateString("de-DE")
                        : "—"}
                    </td>

                    <td className="align-middle text-center">
                      <a
                        href={`/query/${query.id}`}
                        className="btn btn-sm btn-outline-secondary"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </main>
    </>
  );
}