import { Add, Delete, Edit } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import {
  Badge, Breadcrumb, Button, ButtonGroup, Card, Col,
  Container, FloatingLabel, Form, Image, Modal, Row, Spinner, Alert,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";

const API_URL      = import.meta.env.VITE_API_URL;
const BLOB_BASE    = import.meta.env.VITE_BLOB_BASE_URL;
const PHOTO_SLOTS  = 4;

// ── Types ─────────────────────────────────────────────────────────────────────

interface StockPallet {
  id:      number;
  name:    string;
  quality: string;
  url:     string;
}

interface Stock {
  id:        number;
  quantity:  number;
  price:     number;
  pallet:    StockPallet;
  photoUrls: string[];
}

interface ApiPallet {
  id:      number;
  name:    string;
  quality: string;
  url:     string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function photoSrc(url: string): string {
  // Seed photos are plain filenames; real uploads are full blob paths
  return url.startsWith("http") ? url : `${BLOB_BASE}/${url}`;
}

function qualityBadgeBg(quality: string): string {
  return quality === "new" ? "success" : quality === "class_a" ? "primary" : "warning";
}

// ── Photo slot ────────────────────────────────────────────────────────────────

const PhotoSlot = ({
  src, index, inputRef, onUpload, onRemove, disabled,
}: {
  src:      string | null;
  index:    number;
  inputRef: (el: HTMLInputElement | null) => void;
  onUpload: (index: number, file: File) => void;
  onRemove: (index: number) => void;
  disabled: boolean;
}) => (
  <Col>
    <div
      className="border rounded d-flex align-items-center justify-content-center bg-light mb-2"
      style={{ height: 120 }}
    >
      {src ? (
        <img src={src} alt="" style={{ maxHeight: 116, maxWidth: "100%", objectFit: "contain" }} />
      ) : (
        <Add sx={{ fontSize: 48, opacity: 0.25 }} />
      )}
    </div>
    <ButtonGroup size="sm" className="w-100">
      <Button
        variant="outline-secondary"
        onClick={() => (document.getElementById(`file-${index}`) as HTMLInputElement)?.click()}
      >
        {src ? "Replace" : "Upload"}
      </Button>
      <Button variant="outline-danger" disabled={!src || disabled} onClick={() => onRemove(index)}>
        Remove
      </Button>
    </ButtonGroup>
    <Form.Control
      id={`file-${index}`}
      type="file"
      accept="image/*"
      hidden
      ref={inputRef}
      onChange={(e) => {
        const f = (e.target as HTMLInputElement).files?.[0];
        if (f) onUpload(index, f);
      }}
    />
  </Col>
);

// ── Stock Card ────────────────────────────────────────────────────────────────

const StockCard = ({
  stock, onEdit, onDelete,
}: {
  stock:    Stock;
  onEdit:   (s: Stock) => void;
  onDelete: (id: number) => void;
}) => {
  const { t } = useTranslation();
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Row className="align-items-center g-3">

          {/* Pallet identity */}
          <Col xs={12} md={3} className="d-flex gap-3 align-items-center">
            <Image
              src={stock.pallet.url}
              style={{ width: 80, height: 80, objectFit: "contain" }}
              className="rounded bg-light p-1 shadow-sm flex-shrink-0"
            />
            <div>
              <div className="fw-semibold" style={{ fontSize: "0.9rem" }}>
                {t(stock.pallet.name)}
              </div>
              <Badge bg={qualityBadgeBg(stock.pallet.quality)} className="mt-1">
                {t(stock.pallet.quality)}
              </Badge>
            </div>
          </Col>

          {/* Stats */}
          <Col xs={6} md={2}>
            <div className="text-muted" style={{ fontSize: "0.72rem", textTransform: "uppercase" }}>
              {t("quantity")}
            </div>
            <div className="fw-bold fs-5">{stock.quantity.toLocaleString()}</div>
          </Col>

          <Col xs={6} md={2}>
            <div className="text-muted" style={{ fontSize: "0.72rem", textTransform: "uppercase" }}>
              {t("price_per_unit")}
            </div>
            <div className="fw-bold fs-5">
              €{stock.price.toLocaleString("de-DE", { minimumFractionDigits: 2 })}
            </div>
          </Col>

          {/* Photos */}
          <Col xs={12} md={3}>
            {stock.photoUrls.length > 0 ? (
              <div className="d-flex gap-2 flex-wrap">
                {stock.photoUrls.slice(0, 4).map((url, i) => (
                  <img
                    key={i}
                    src={photoSrc(url)}
                    alt=""
                    style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6 }}
                    className="shadow-sm border"
                  />
                ))}
                {stock.photoUrls.length > 4 && (
                  <div
                    className="d-flex align-items-center justify-content-center border rounded text-muted"
                    style={{ width: 56, height: 56, fontSize: "0.8rem" }}
                  >
                    +{stock.photoUrls.length - 4}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-muted" style={{ fontSize: "0.8rem" }}>{t("no_photos")}</span>
            )}
          </Col>

          {/* Actions */}
          <Col xs={12} md={2} className="d-flex flex-column gap-2">
            <Button size="sm" variant="outline-primary" onClick={() => onEdit(stock)} className="d-flex align-items-center gap-1 justify-content-center">
              <Edit fontSize="small" /> {t("edit")}
            </Button>
            <Button size="sm" variant="outline-danger" onClick={() => onDelete(stock.id)} className="d-flex align-items-center gap-1 justify-content-center">
              <Delete fontSize="small" /> {t("delete")}
            </Button>
          </Col>

        </Row>
      </Card.Body>
    </Card>
  );
};

// ── Stock Form Modal ──────────────────────────────────────────────────────────

const StockModal = ({
  show,
  editingStock,
  pallets,
  onSave,
  onClose,
}: {
  show:         boolean;
  editingStock: Stock | null;
  pallets:      ApiPallet[];
  onSave:       (formData: FormData, stockId?: number) => Promise<void>;
  onClose:      () => void;
}) => {
  const { t } = useTranslation();

  const palletNames = [...new Set(pallets.map((p) => p.name))];
  const [selectedName,    setSelectedName]    = useState("");
  const [selectedQuality, setSelectedQuality] = useState("");
  const [quantity,        setQuantity]        = useState(0);
  const [price,           setPrice]           = useState(0);
  const [newFiles,        setNewFiles]        = useState<(File | null)[]>(Array(PHOTO_SLOTS).fill(null));
  const [keptUrls,        setKeptUrls]        = useState<string[]>([]);
  const [saving,          setSaving]          = useState(false);
  const [error,           setError]           = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const qualitiesForName = [...new Set(pallets.filter((p) => p.name === selectedName).map((p) => p.quality))];
  const previewPallet    = pallets.find((p) => p.name === selectedName && p.quality === selectedQuality);

  // Populate form when editing
  useEffect(() => {
    if (editingStock) {
      setSelectedName(editingStock.pallet.name);
      setSelectedQuality(editingStock.pallet.quality);
      setQuantity(editingStock.quantity);
      setPrice(editingStock.price);
      setKeptUrls([...editingStock.photoUrls]);
    } else {
      setSelectedName(palletNames[0] ?? "");
      setSelectedQuality("");
      setQuantity(0);
      setPrice(0);
      setKeptUrls([]);
    }
    setNewFiles(Array(PHOTO_SLOTS).fill(null));
    setError("");
  }, [editingStock, show]);

  // Keep quality in sync when name changes
  useEffect(() => {
    const available = pallets.filter((p) => p.name === selectedName).map((p) => p.quality);
    if (!available.includes(selectedQuality)) setSelectedQuality(available[0] ?? "");
  }, [selectedName]);

  // Slots: first fill with kept existing photos, then new file slots
  const slotSrcs: (string | null)[] = Array(PHOTO_SLOTS).fill(null).map((_, i) => {
    if (newFiles[i]) return URL.createObjectURL(newFiles[i]!);
    if (keptUrls[i]) return photoSrc(keptUrls[i]);
    return null;
  });

  function handleUpload(index: number, file: File) {
    // If there was a kept URL at this slot, remove it
    setKeptUrls((prev) => { const c = [...prev]; c[index] = ""; return c; });
    setNewFiles((prev) => { const c = [...prev]; c[index] = file; return c; });
  }

  function handleRemove(index: number) {
    setKeptUrls((prev) => { const c = [...prev]; c[index] = ""; return c; });
    setNewFiles((prev) => { const c = [...prev]; c[index] = null; return c; });
  }

  async function handleSubmit() {
    const pallet = pallets.find((p) => p.name === selectedName && p.quality === selectedQuality);
    if (!pallet) { setError("Please select a valid pallet and quality."); return; }

    setSaving(true);
    setError("");

    const fd = new FormData();
    const stockJson: Record<string, unknown> = {
      paletteId: pallet.id,
      quantity,
      price,
    };
    if (editingStock) {
      // keepPhotoIds not applicable with URL-based response; backend handles by blobName
      stockJson.keepPhotoUrls = keptUrls.filter(Boolean);
    }
    fd.append("stock", new Blob([JSON.stringify(stockJson)], { type: "application/json" }));
    newFiles.filter((f): f is File => f !== null).forEach((f) => fd.append("files", f));

    try {
      await onSave(fd, editingStock?.id);
    } catch (err: any) {
      setError(err.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal show={show} size="lg" centered onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{editingStock ? t("update_inventory") : t("add_inventory")}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger" className="py-2">{error}</Alert>}

        <Row className="g-3">
          {/* Pallet preview */}
          <Col md={4} className="d-flex align-items-center justify-content-center">
            {previewPallet?.url ? (
              <Image fluid src={previewPallet.url} style={{ maxHeight: 180 }} />
            ) : (
              <div className="text-muted text-center py-4">{t("select_pallet")}</div>
            )}
          </Col>

          {/* Selectors */}
          <Col md={8}>
            <Row className="g-2">
              <Col xs={12}>
                <FloatingLabel label={t("pallet")}>
                  <Form.Select value={selectedName} onChange={(e) => setSelectedName(e.target.value)}>
                    {palletNames.map((n) => <option key={n} value={n}>{t(n)}</option>)}
                  </Form.Select>
                </FloatingLabel>
              </Col>

              <Col xs={12}>
                <FloatingLabel label={t("quality")}>
                  <Form.Select value={selectedQuality} onChange={(e) => setSelectedQuality(e.target.value)}>
                    {qualitiesForName.map((q) => <option key={q} value={q}>{t(q)}</option>)}
                  </Form.Select>
                </FloatingLabel>
              </Col>

              <Col xs={6}>
                <FloatingLabel label={t("quantity")}>
                  <Form.Control
                    type="number" min={0} value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </FloatingLabel>
              </Col>

              <Col xs={6}>
                <FloatingLabel label={`${t("price_per_unit")} (€)`}>
                  <Form.Control
                    type="number" min={0} step={0.01} value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </FloatingLabel>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Photo slots */}
        <div className="mt-4">
          <div className="text-muted mb-2" style={{ fontSize: "0.8rem", textTransform: "uppercase" }}>
            Photos (up to {PHOTO_SLOTS})
          </div>
          <Row xs={2} sm={4} className="g-2">
            {Array(PHOTO_SLOTS).fill(null).map((_, i) => (
              <PhotoSlot
                key={i}
                index={i}
                src={slotSrcs[i]}
                inputRef={(el) => (inputRefs.current[i] = el)}
                onUpload={handleUpload}
                onRemove={handleRemove}
                disabled={saving}
              />
            ))}
          </Row>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose} disabled={saving}>
          {t("cancel")}
        </Button>
        <Button variant="success" onClick={handleSubmit} disabled={saving}>
          {saving
            ? <><Spinner size="sm" animation="border" className="me-1" />{t("saving")}</>
            : editingStock ? t("update_inventory") : t("add_inventory")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProductPage() {
  const { t } = useTranslation();

  const [stocks,  setStocks]  = useState<Stock[]>([]);
  const [pallets, setPallets] = useState<ApiPallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [showModal,     setShowModal]     = useState(false);
  const [editingStock,  setEditingStock]  = useState<Stock | null>(null);

  async function fetchStocks() {
    const res = await fetch(`${API_URL}/v1/stocks/seller`, { credentials: "include" });
    if (!res.ok) throw new Error(`Failed to load stocks: ${res.status}`);
    setStocks(await res.json());
  }

  async function fetchPallets() {
    const res = await fetch(`${API_URL}/v1/pallets`, { credentials: "include" });
    if (!res.ok) throw new Error(`Failed to load pallets: ${res.status}`);
    setPallets(await res.json());
  }

  useEffect(() => {
    Promise.all([fetchStocks(), fetchPallets()])
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function openAdd() { setEditingStock(null); setShowModal(true); }
  function openEdit(stock: Stock) { setEditingStock(stock); setShowModal(true); }
  function closeModal() { setShowModal(false); setEditingStock(null); }

  async function handleSave(formData: FormData, stockId?: number) {
    const url    = stockId ? `${API_URL}/v1/stocks/${stockId}` : `${API_URL}/v1/stocks`;
    const method = stockId ? "PUT" : "POST";
    const res = await fetch(url, { method, credentials: "include", body: formData });
    if (!res.ok) throw new Error(`Save failed: ${res.status}`);
    await fetchStocks();
    closeModal();
  }

  async function handleDelete(stockId: number) {
    if (!window.confirm(t("confirm_delete_inventory"))) return;
    const res = await fetch(`${API_URL}/v1/stocks/${stockId}`, {
      method: "DELETE", credentials: "include",
    });
    if (res.ok) await fetchStocks();
    else setError(`Delete failed: ${res.status}`);
  }

  return (
    <Container fluid className="px-4 pb-5">
      <Breadcrumb className="pt-3 pb-2">
        <Breadcrumb.Item href="/">{t("home")}</Breadcrumb.Item>
        <Breadcrumb.Item active>{t("inventory")}</Breadcrumb.Item>
      </Breadcrumb>

      {/* ── Toolbar ── */}
      <Row className="align-items-center mb-3">
        <Col>
          <h5 className="mb-0 fw-semibold">{t("inventory")}</h5>
          {!loading && (
            <small className="text-muted">
              {stocks.length} {t("pallets_available")}
            </small>
          )}
        </Col>
        <Col xs="auto">
          <Button variant="success" onClick={openAdd} className="d-flex align-items-center gap-1">
            <Add fontSize="small" /> {t("add_inventory")}
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}

      {/* ── Content ── */}
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : stocks.length === 0 ? (
        <Alert variant="light" className="text-center text-muted">{t("no_pallets_available")}</Alert>
      ) : (
        <div className="d-flex flex-column gap-3">
          {stocks.map((stock) => (
            <StockCard
              key={stock.id}
              stock={stock}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <StockModal
        show={showModal}
        editingStock={editingStock}
        pallets={pallets}
        onSave={handleSave}
        onClose={closeModal}
      />
    </Container>
  );
}