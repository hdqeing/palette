import { Add, Edit, RemoveCircle } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Badge, Breadcrumb, Button, ButtonGroup, Card, Col, FloatingLabel, Form, Image, Modal, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useRef } from "react";


export default function ProductPage(){

    const API_URL = import.meta.env.VITE_API_URL;
    const blobBaseUrl = import.meta.env.VITE_BLOB_BASE_URL;
    const { t } = useTranslation();
    const [stocks, setStocks] = useState([]);
    const [images, setImages] = useState<(File | null)[]>([null, null, null, null]);
    const [keptPhotoIds, setKeptPhotoIds] = useState<number[]>([]);
    const [palletNames, setPalletNames] = useState([]);
    const [qualities, setQualities] = useState([]);
    const [selectedPalletName, setSelectedPalletName] = useState("");
    const [selectedQuality, setSelectedQuality] = useState("");
    const [selectedQuantity, setSelectedQuantity] = useState(0);
    const [selectedPrice, setSelectedPrice] = useState(0);
    const [pallets, setPallets] = useState([]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingStock, setEditingStock] = useState(null);

    const selectedPalletUrl = pallets.find(
        (p) => p.name === selectedPalletName && p.quality === selectedQuality
    )?.url;

    const resetModal = () => {
        setEditingStock(null);
        setSelectedPalletName("");
        setSelectedQuality("");
        setSelectedQuantity(0);
        setSelectedPrice(0);
        setImages([null, null, null, null]);
        setKeptPhotoIds([]);
        setShowModal(false);
    };

    const openAddModal = () => {
        resetModal();
        setShowModal(true);
    };

    const openEditModal = (stock) => {
        setEditingStock(stock);
        setSelectedPalletName(stock.pallet.name);
        setSelectedQuality(stock.pallet.quality);
        setSelectedQuantity(stock.quantity);
        setSelectedPrice(stock.price);
        setImages([null, null, null, null]);
        setKeptPhotoIds(stock.photos?.map((p) => p.id) ?? []);
        setShowModal(true);
    };

    const handleDeleteInventory = async (stockId: number) => {
        try {
            const response = await fetch(`${API_URL}/v1/stocks/${stockId}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    'accept': '*/*'
                }
            })

            if (response.status === 204) {
                console.log("Inventory deleted successfully!")
                await getInventories();
            }

        } catch (error) {
            console.log(error)
        }
    }

    const handleAddInventory = async () => {
        const selectedPallet = pallets.find((pallet) => pallet.name === selectedPalletName && pallet.quality === selectedQuality);

        const formData = new FormData();

        formData.append(
            "stock",
            new Blob(
            [
                JSON.stringify({
                paletteId: selectedPallet.id,
                quantity: selectedQuantity,
                price: selectedPrice,
                }),
            ],
            { type: "application/json" }
            )
        );

        images
            .filter((img): img is File => img !== null)
            .forEach((img) => {
            formData.append("files", img);
            });

        const response = await fetch(`${API_URL}/v1/stocks`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to add inventory");
        }

        await getInventories();
        resetModal();
    };

    const handleUpdateInventory = async () => {
        const selectedPallet = pallets.find((pallet) => pallet.name === selectedPalletName && pallet.quality === selectedQuality);

        const formData = new FormData();

        formData.append(
            "stock",
            new Blob(
            [
                JSON.stringify({
                paletteId: selectedPallet.id,
                quantity: selectedQuantity,
                price: selectedPrice,
                keepPhotoIds: keptPhotoIds,
                }),
            ],
            { type: "application/json" }
            )
        );

        images
            .filter((img): img is File => img !== null)
            .forEach((img) => {
            formData.append("files", img);
            });

        const response = await fetch(`${API_URL}/v1/stocks/${editingStock.id}`, {
            method: "PUT",
            credentials: "include",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to update inventory");
        }

        await getInventories();
        resetModal();
    };

    const handleUpload = (index: number, file: File | null) => {
        if (!file) return;

        // If a new file is uploaded to a slot that had an existing photo, remove it from keptPhotoIds
        const existingPhoto = editingStock?.photos?.[index];
        if (existingPhoto) {
            setKeptPhotoIds((prev) => prev.filter((id) => id !== existingPhoto.id));
        }

        setImages((prev) => {
            const copy = [...prev];
            copy[index] = file;
            return copy;
        });
    };

    const handleDelete = (index: number) => {
        // If this slot has an existing photo, mark it as removed from keptPhotoIds
        const existingPhoto = editingStock?.photos?.[index];
        if (existingPhoto) {
            setKeptPhotoIds((prev) => prev.filter((id) => id !== existingPhoto.id));
        }

        setImages((prev) => {
            const copy = [...prev];
            copy[index] = null;
            return copy;
        });
    };

    const getInventories = async () => {
        try {
            const response = await fetch(`${API_URL}/v1/stocks/seller`, {
                credentials: "include",
                headers: {
                    "Accept": "*/*"
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStocks(data);
            }

        } catch (error) {
            console.log(error)
        }
    }

    const getPallets = async () => {
        try {
            const response = await fetch(`${API_URL}/v1/pallets`, {
                credentials: "include",
                headers: {
                    "Accept": "*/*"
                }
            });

            if (response.ok) {
                const data = await response.json();
                setPallets(data);
                setPalletNames([... new Set(data.map((pallet) => pallet.name))]);
                setQualities([... new Set(data.map((pallet) => pallet.quality))]);
            }

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        getInventories();
        getPallets();
    },[])

    return (
        <div className="p-4">
            <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Inventory</Breadcrumb.Item>
            </Breadcrumb>

            <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between">
                    <Button variant="outline-success" className="d-flex align-items-center" onClick={openAddModal}><Add></Add>{t("add_inventory")}</Button>
                    <h5>{stocks.length} {t("pallets_available")}</h5>
                </div>

            {stocks.length === 0 ? (
                <p className="text-muted">{t("no_pallets_available")}</p>
            ) : (
                stocks.map((stock) => (
                <Card key={stock.id} className="shadow-sm">
                    <Card.Body>
                    <Row className="align-items-center align-items-stretch">
                        <Col className="d-flex gap-2 align-items-center border-end">
                            <Image src={stock.pallet.url} style={{ width: 96, height: 96, objectFit: "contain" }} className="shadow rounded bg-body-tertiary p-2"/>

                            <div>
                                <h6>{t(stock.pallet.name)}</h6>
                                <Badge bg={stock.pallet.quality === "new" ? "success" : "warning"}>{t(stock.pallet.quality)}</Badge>
                            </div>
                        </Col>

                        <Col className="border-end d-flex flex-column gap-2">
                            <FloatingLabel controlId="floatingQuantity" label={t("quantity")}>
                                <Form.Control type="number" value={stock.quantity} disabled/>
                            </FloatingLabel>

                            <FloatingLabel controlId="floatingPrice" label={t("price_per_unit")}>
                                <Form.Control type="number" value={stock.price.toFixed(2)} disabled/>
                            </FloatingLabel>
                       </Col>

                        <Col className="border-end d-flex gap-2 justify-content-center align-items-center">
                        {stock.photos?.length > 0 ? (
                            <>
                            {stock.photos.slice(0, 4).map((photo) => (
                                <Image
                                key={photo.id}
                                src={`${blobBaseUrl}/${photo.blobName}`}
                                style={{ width: 72, height: 72, objectFit: "contain", borderRadius: 8 }}
                                className="shadow-sm"
                                />
                            ))}
                            </>
                        ) : (
                            <p className="text-muted small text-end mb-0">{t("no_photos")}</p>
                        )}
                        </Col>

                        <Col className="d-flex flex-column justify-content-evenly">
                            <Button variant="warning" onClick={() => openEditModal(stock)}><Edit></Edit>{t("update_inventory")}</Button>
                            <Button variant="outline-danger" onClick={() => handleDeleteInventory(stock.id)}><RemoveCircle></RemoveCircle>{t("delete_inventory")}</Button>
                        </Col>
                    </Row>
                    </Card.Body>
                </Card>
                ))
            )}
            </div>

            <Modal show={showModal} size="lg" centered>
                <Modal.Header className="justify-content-center">
                    <Modal.Title>{editingStock ? t("update_inventory") : t("add_inventory")}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Row>
                        <Col>
                            <Image fluid src={selectedPalletUrl} />
                        </Col>

                        <Col className="d-flex flex-column gap-2">
                            <FloatingLabel controlId="floatingPallet" label={t("pallet")}>
                                <Form.Select value={selectedPalletName} onChange={(e) => setSelectedPalletName(e.target.value)}>
                                    {palletNames.map((name) => (<option key={name} value={name}>{t(name)}</option>))}
                                </Form.Select>
                            </FloatingLabel>

                            <FloatingLabel controlId="floatingQuality" label={t("quality")}>
                                <Form.Select value={selectedQuality} onChange={(e) => setSelectedQuality(e.target.value)}>
                                    {qualities.map((quality) => (<option key={quality} value={quality}>{t(quality)}</option>))}
                                </Form.Select>
                            </FloatingLabel>

                            <FloatingLabel controlId="floatingQuantity" label={t("quantity")}>
                                <Form.Control type="number" value={selectedQuantity} onChange={(e) => setSelectedQuantity(Number(e.target.value))}/>
                            </FloatingLabel>

                            <FloatingLabel controlId="floatingPrice" label={t("price_per_unit")}>
                                <Form.Control type="number" value={selectedPrice} onChange={(e) => setSelectedPrice(Number(e.target.value))}/>
                            </FloatingLabel>
                        </Col>
                    </Row>

                    <Row className="mt-3">
                    {images.map((img, index) => {
                        const existingPhoto = editingStock?.photos?.[index];
                        const isKept = existingPhoto && keptPhotoIds.includes(existingPhoto.id);
                        const previewSrc = img
                            ? URL.createObjectURL(img)
                            : isKept
                            ? `${blobBaseUrl}/${existingPhoto.blobName}`
                            : null;

                        return (
                            <Col key={index}>
                            <Row className="justify-content-center">
                                {previewSrc ? (
                                <img
                                    src={previewSrc}
                                    style={{ width: 144, height: 144, objectFit: "cover" }}
                                />
                                ) : (
                                <Add
                                    style={{ height: 144, width: 144 }}
                                    color="warning"
                                    sx={{ opacity: 0.5 }}
                                />
                                )}

                                <Form.Control
                                type="file"
                                accept="image/*"
                                hidden
                                ref={(el) => (inputRefs.current[index] = el)}
                                onChange={(e) => handleUpload(index, e.target.files?.[0] || null)}
                                />
                            </Row>

                            <Row className="mt-2">
                                <ButtonGroup>
                                <Button variant="success" onClick={() => inputRefs.current[index]?.click()}>
                                    Upload
                                </Button>
                                <Button variant="outline-danger" onClick={() => handleDelete(index)} disabled={!img && !isKept}>
                                    Delete
                                </Button>
                                </ButtonGroup>
                            </Row>
                            </Col>
                        );
                    })}
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Col>
                        <Button variant="outline-danger" className="w-100" onClick={resetModal}>{t("cancel")}</Button>
                    </Col>
                    <Col>
                        <Button variant="success" className="w-100" onClick={editingStock ? handleUpdateInventory : handleAddInventory}>
                            {editingStock ? t("update_inventory") : t("add_inventory")}
                        </Button>
                    </Col>
                </Modal.Footer>
            </Modal>

        </div>
    )
}