import { useEffect, useState } from "react";
import type {CartEntity, GroupedPallet, Palette, PaletteSort, Pallet, PalletSort, StockSummary} from "~/types";
import {Col, Row, Image, Button, Modal, FloatingLabel, Form, Breadcrumb, Accordion, ButtonGroup, Badge, Spinner, Card, ListGroup, Container} from "react-bootstrap";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { AttachFile, CheckCircleOutlined, Euro, Group, Help, LocalShipping, Sell, SquareFoot } from "@mui/icons-material";
import { useAppContext } from "~/layouts/layout";
import { useTranslation } from "react-i18next";
import { Fade } from "@mui/material";

export default function Home() {

  const apiUrl=import.meta.env.VITE_API_URL;
  const { t } = useTranslation();

  const [authenticated, setAuthenticated, paletteInCart, setPaletteInCart] = useAppContext();
  const [showAddPaletteModal, setShowAddPaletteModal] = useState(false);
  const [myPallets, setMyPallets] = useState<Pallet[]>([]);
  const [groupedPallets, setGroupedPallets] = useState<GroupedPallet[]>([]);
  const [selectedQualities, setSelectedQualities] = useState<Record<string, string>>({});
  const [selectedPallet, setSelectedPallet] = useState<Pallet | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [palletSorts, setPalletSorts] = useState([]);
  const [selectedSortIds, setSelectedSortIds] = useState<number[]>([]);
  const [selectedLength, setSelectedLength] = useState("");
  const [selectedWidth, setSelectedWidth] = useState("");
  const [selectedHeight, setSelectedHeight] = useState("");
  const [stockSummaries, setStockSummaries] = useState<Record<number, StockSummary>>({});

  const lengthOptions = [...new Set(myPallets.map((p) => p.length))].sort((a, b) => a - b);
  const widthOptions = [...new Set(myPallets.map((p) => p.width))].sort((a, b) => a - b);
  const heightOptions = [...new Set(myPallets.map((p) => p.height))].sort((a, b) => a - b);

  // ─── Custom pallet modal ──────────────────────────────────────────────────
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [customSubmitting, setCustomSubmitting] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);
  const [customSuccess, setCustomSuccess] = useState(false);

  const resetCustomModal = () => {
  setCustomName("");
  setCustomDescription("");
  setCustomFile(null);
  setCustomError(null);
  setCustomSuccess(false);
  setCustomSubmitting(false);
  };

  const handleCreateCustomPallet = async () => {
  if (!customName.trim()) { setCustomError(t("error_name_required")); return; }
  if (!customDescription.trim()) { setCustomError(t("error_description_required")); return; }

  setCustomSubmitting(true);
  setCustomError(null);

  const form = new FormData();
  form.append("name", customName.trim());
  form.append("description", customDescription.trim());
  if (customFile) form.append("file", customFile);

  try {
    const res = await fetch(`${apiUrl}/v1/pallets/custom`, {
      method: "POST",
      credentials: "include",
      body: form,
    });

    if (res.ok) {
      setCustomSuccess(true);
      getMyPallets();
    } else {
      const text = await res.text();
      setCustomError(text || t("error_generic"));
    }
  } catch {
    setCustomError(t("error_network"));
  } finally {
    setCustomSubmitting(false);
  }
  };

  const addPaletteToCart = async (pallet: Pallet | undefined, quantity: number) => {
      if (!pallet || quantity <= 0) return;

      await fetch(`${apiUrl}/v1/carts/${pallet.id}?quantity=${quantity}`, {
          method: 'POST',
          credentials: 'include',
      });

      // Update local state immediately so the cart reflects the change
      setPaletteInCart(prev => {
          const existing = prev.find(p => p.pallet?.id === pallet.id);
          if (existing) {
              // increment quantity if already in cart
              return prev.map(p =>
                  p.pallet?.id === pallet.id
                      ? { ...p, quantity: p.quantity + quantity }
                      : p
              );
          }
          return [...prev, { pallet, quantity }];
      });

      setShowAddPaletteModal(false);
  };

  const groupPalletsByQuality = (pallets : Pallet[]) => {
    const grouped = new Map();

    pallets.forEach((pallet) => {
      const key = [
        pallet.palletSort?.id,
        pallet.name,
        pallet.boards,
        pallet.nails,
        pallet.blocks,
        pallet.length,
        pallet.width,
        pallet.height,
        pallet.safeWorkingLoad,
        pallet.weight,
      ].join("|");

      if (!grouped.has(key)) {
        grouped.set(key, {
          ...pallet,
          ids: [],
          qualities: [],
          qualityItems: [],
        });
      }

      const item = grouped.get(key);

      item.ids.push(pallet.id);
      item.qualities.push(pallet.quality);
      item.qualityItems.push({
        id: pallet.id,
        quality: pallet.quality,
        url: pallet.url,
      });
    });

    return Array.from(grouped.values());
  };

  const getMyPallets = async () => {
    try {
      const endpoint = authenticated ? `${apiUrl}/v1/pallets/my` : `${apiUrl}/v1/pallets`;
      const response = await fetch(endpoint, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setMyPallets(data);
        setGroupedPallets(groupPalletsByQuality(data));
      }

    } catch (error) {
        console.log(error)
    }
  };

  const getPalletSorts = async () => {
    try {
      const response = await fetch(`${apiUrl}/v1/pallets/sorts`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setPalletSorts(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSortFilterChange = (sortId: number, checked: boolean) => {
    setSelectedSortIds((prev) =>
      checked
        ? [...prev, sortId]
        : prev.filter((id) => id !== sortId)
    );
  };

  const getStockSummaryForPallet = async (palletId: number) => {
    try {
      const response = await fetch(`${apiUrl}/v1/stocks/pallet/${palletId}`, {
        credentials: "include",
      });

      if (!response.ok) return;

      const stocks = await response.json();

      const sellerIds = new Set(stocks.map((stock: any) => stock.company.id));

      const totalQuantity = stocks.reduce(
        (sum: number, stock: any) => sum + stock.quantity,
        0
      );

      const prices = stocks.map((stock: any) => stock.price);
      const minPrice = prices.length > 0 ? Math.min(...prices) : null;

      setStockSummaries((prev) => ({
        ...prev,
        [palletId]: {
          sellerCount: sellerIds.size,
          totalQuantity,
          minPrice,
        },
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    myPallets.forEach((pallet) => {
      if (!stockSummaries[pallet.id]) {
        getStockSummaryForPallet(pallet.id);
      }
    });
  }, [myPallets]);

  useEffect(()=>{
      getMyPallets();
      getPalletSorts();
  }, [])

  const filteredGroupedPallets = groupedPallets.filter((groupedPallet) => {
    const matchesType =
      selectedSortIds.length === 0 ||
      selectedSortIds.includes(groupedPallet.palletSort?.id);

    const matchesLength =
      !selectedLength || groupedPallet.length === Number(selectedLength);

    const matchesWidth =
      !selectedWidth || groupedPallet.width === Number(selectedWidth);

    const matchesHeight =
      !selectedHeight || groupedPallet.height === Number(selectedHeight);

    return matchesType && matchesLength && matchesWidth && matchesHeight;
  });

  return (
    <>
      <div style={{ backgroundColor: "burlywood" }} className="d-flex justify-content-center vw-100">
        <nav aria-label="breadcrumb" className="w-75 py-2">
          <ol className="breadcrumb m-0">
            <li className="breadcrumb-item active">Home</li>
          </ol>
        </nav>
      </div>

      <main className="d-flex flex-column align-items-center">
        <Row className="w-75">
          <Col className="p-0 my-4">
            <Fade in={true} timeout={1000}> 
              <h3>{t("slogan")}</h3>
            </Fade>
          </Col>

          <Col className="p-0 my-4 d-flex justify-content-end">
            <Button
              variant="warning"
              className="d-flex gap-1"
              onClick={() => { resetCustomModal(); setShowCustomModal(true); }}
            >
              <Help /><p className="m-0">{t("create_own")}</p>
            </Button>
          </Col>
        </Row>

        <Row className="w-75 mb-4">
          <Col xxl="2" className="ps-0 pe-4">
            <Form>
              <Accordion defaultActiveKey={["type", "size"]} alwaysOpen>
                <Accordion.Item eventKey="type">
                  <Accordion.Header>{t("type")}</Accordion.Header>

                  <Accordion.Body>
                    {palletSorts.map((sort: PalletSort) => (
                      <Form.Check
                        key={sort.id}
                        type="checkbox"
                        label={t(sort.name)}
                        checked={selectedSortIds.includes(sort.id)}
                        onChange={(e) =>
                          handleSortFilterChange(sort.id, e.target.checked)
                        }
                      />
                    ))}
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="size">
                  <Accordion.Header>{t("size")}</Accordion.Header>

                  <Accordion.Body className="d-flex flex-column gap-2">
                    <FloatingLabel controlId="filterLength" label={t("length")}>
                      <Form.Select
                        value={selectedLength}
                        onChange={(e) => setSelectedLength(e.target.value)}
                      >
                        <option value="">{t("all")}</option>
                        {lengthOptions.map((length) => (
                          <option key={length} value={length}>
                            {length.toLocaleString()} mm
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>

                    <FloatingLabel controlId="filterWidth" label={t("width")}>
                      <Form.Select
                        value={selectedWidth}
                        onChange={(e) => setSelectedWidth(e.target.value)}
                      >
                        <option value="">{t("all")}</option>
                        {widthOptions.map((width) => (
                          <option key={width} value={width}>
                            {width.toLocaleString()} mm
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>

                    <FloatingLabel controlId="filterHeight" label={t("height")}>
                      <Form.Select
                        value={selectedHeight}
                        onChange={(e) => setSelectedHeight(e.target.value)}
                      >
                        <option value="">{t("all")}</option>
                        {heightOptions.map((height) => (
                          <option key={height} value={height}>
                            {height.toLocaleString()} mm
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Form>
          </Col>

          <Col xxl="10" className="p-0">
            <Row xs={1} md={2} className="g-2">
            {filteredGroupedPallets.map((groupedPallet: GroupedPallet) => {
              const groupKey = groupedPallet.ids.join("-");

              const selectedQuality =
                selectedQualities[groupKey] ?? groupedPallet.qualities[0];

              const selectedQualityItem = groupedPallet.qualityItems.find(
                (item) => item.quality === selectedQuality
              );

              return (
                <Col>
                  <Card className="mt-0 mb-2">
                    <Card.Img
                      src={selectedQualityItem?.url ?? groupedPallet.qualityItems[0].url}
                      style={{ height: 144, objectFit: "contain" }}
                      variant="top"
                      className="mx-auto d-block"
                    ></Card.Img>

                    <Card.Body className="d-flex flex-column gap-2">
                      <Card.Title className="text-center">{t(groupedPallet.name)}</Card.Title>

                      <Form.Select
                        value={selectedQuality}
                        onChange={(e) => {
                          setSelectedQualities((prev) => ({
                            ...prev,
                            [groupKey]: e.target.value,
                          }));
                        }}
                      >
                        {groupedPallet.qualities.map((quality) => (
                          <option key={quality} value={quality}>
                            {t(quality)}
                          </option>
                        ))}
                      </Form.Select>

                      <ListGroup>
                        <ListGroup.Item>
                          <SquareFoot className="me-1"></SquareFoot>{groupedPallet.length} × {groupedPallet.width} × {groupedPallet.height} mm
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Group className="me-1"/>{stockSummaries[selectedQualityItem.id]?.sellerCount ?? 0}{" "}{t("seller")}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Sell className="me-1"/>{stockSummaries[selectedQualityItem.id]?.totalQuantity?.toLocaleString() ?? 0}{" "}{t("immediately_available")}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <Euro className="me-1"/>
                            {stockSummaries[selectedQualityItem.id]?.minPrice !== null &&
                            stockSummaries[selectedQualityItem.id]?.minPrice !== undefined
                              ? `${t("from")} € ${stockSummaries[selectedQualityItem.id].minPrice.toFixed(2)}`
                              : t("no_price_available")}
                        </ListGroup.Item>
                      </ListGroup>
                    </Card.Body>

                    <Card.Footer className="d-flex gap-2">
                      <Col>
                        <Button
                          className="w-100"
                          variant="outline-success"
                          onClick={() => {
                            const selectedPallet = myPallets.find(p => p.id === selectedQualityItem?.id);
                            setSelectedPallet(selectedPallet);
                            setShowAddPaletteModal(true);
                          }}
                        >
                          <AddShoppingCartIcon /> {t("add_to_cart")}
                        </Button>
                      </Col>

                      <Col>
                        <Button variant="outline-primary" href={`/pallet/${selectedQualityItem?.id}/stock`} className="w-100">
                          <LocalShipping /> {t("who_sells_it")}
                        </Button>                      
                      </Col>
                    </Card.Footer>
                  </Card>                
                </Col>
              );
            })}
            </Row>
          </Col>
        </Row>

        <Modal show={showAddPaletteModal} centered size="sm">

          <Modal.Header className="justify-content-center gap-1">
            <AddShoppingCartIcon color="success"></AddShoppingCartIcon>
            <Modal.Title>{t("add_pallet")}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form className="d-flex flex-column gap-2">
              <FloatingLabel controlId="floatingQuantity" label="Pallet">
                <Form.Control disabled value={t(selectedPallet?.name)} />
              </FloatingLabel>

              <FloatingLabel controlId="floatingQuantity" label="Quantity">
                <Form.Control disabled value={t(selectedPallet?.quality)} />
              </FloatingLabel>              

              <FloatingLabel controlId="floatingQuantity" label="Quantity">
                <Form.Control type="number" placeholder="0" onChange={(e) => setSelectedQuantity(Number(e.target.value))}/>
              </FloatingLabel>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button className="w-100" variant="outline-danger" onClick={() => setShowAddPaletteModal(false)}>{t("cancel")}</Button>

            <Button
                className="w-100"
                variant="success"
                onClick={() => addPaletteToCart(selectedPallet, selectedQuantity)}
            >
                {t("add")}
            </Button>
          </Modal.Footer>

        </Modal>

        <Modal
        show={showCustomModal}
        onHide={() => { if (!customSubmitting) { setShowCustomModal(false); resetCustomModal(); } }}
        centered
        size="lg"
        >
        <Modal.Header closeButton={!customSubmitting}>
          <Modal.Title className="d-flex align-items-center gap-2">
            <Help color="warning" />
            {t("create_own")}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {customSuccess ? (
            <div className="text-center py-3">
              <CheckCircleOutlined style={{ fontSize: 48, color: "green" }} />
              <p className="mt-3 fw-semibold">{t("custom_pallet_created")}</p>
              <Button
                variant="success"
                className="w-100 mt-2"
                onClick={() => { setShowCustomModal(false); resetCustomModal(); }}
              >
                {t("close")}
              </Button>
            </div>
          ) : (
            <Form>
              {customError && (
                <div className="alert alert-danger py-2 small">{customError}</div>
              )}

              <FloatingLabel controlId="customName" label={t("name")} className="mb-3">
                <Form.Control
                  type="text"
                  placeholder={t("name")}
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  disabled={customSubmitting}
                />
              </FloatingLabel>

              <FloatingLabel controlId="customDescription" label={t("description")} className="mb-3">
                <Form.Control
                  as="textarea"
                  placeholder={t("description")}
                  style={{ height: "120px" }}
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  disabled={customSubmitting}
                />
              </FloatingLabel>

              <Form.Group controlId="customFile" className="mb-2">
                <Form.Label className="small text-muted">
                  {t("upload_file_optional")}
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    setCustomFile(target.files?.[0] ?? null);
                  }}
                  disabled={customSubmitting}
                />
                <Form.Text className="text-muted">
                  {t("upload_file_hint")}
                </Form.Text>
              </Form.Group>

              {customFile && (
                <div className="d-flex align-items-center gap-2 small text-muted mt-1">
                  <AttachFile fontSize="small" />
                  {customFile.name}
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-danger"
                    onClick={() => setCustomFile(null)}
                  >
                    {t("remove")}
                  </Button>
                </div>
              )}
            </Form>
          )}
        </Modal.Body>

        {!customSuccess && (
          <Modal.Footer>
            <Button
              variant="outline-danger"
              onClick={() => { setShowCustomModal(false); resetCustomModal(); }}
              disabled={customSubmitting}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="warning"
              onClick={handleCreateCustomPallet}
              disabled={customSubmitting}
            >
              {customSubmitting ? (
                <><Spinner animation="border" size="sm" className="me-1" />{t("submitting")}</>
              ) : (
                t("submit")
              )}
            </Button>
          </Modal.Footer>
        )}
        </Modal>
      </main>
    </>
  );
}