import { useEffect, useState } from "react";
import type {CartEntity, GroupedPallet, Palette, PaletteSort, Pallet, PalletSort, StockSummary} from "~/types";
import {Col, Row, Image, Button, Modal, FloatingLabel, Form, Breadcrumb, Accordion, ButtonGroup, Badge} from "react-bootstrap";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Euro, Group, Help, LocalShipping, Sell } from "@mui/icons-material";
import { useAppContext } from "~/layouts/layout";
import { useTranslation } from "react-i18next";

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

  const addPaletteToCart = (p: Pallet, n: number) => {
    setPaletteInCart([...paletteInCart, {pallet: p, quantity: n}]);
    setShowAddPaletteModal(false)
  }

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
      const response = await fetch(`${apiUrl}/v1/pallets`, {
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
      selectedSortIds.includes(groupedPallet.palletSort.id);

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
          <Col className="p-0 my-4"><h3>{t("slogan")}</h3></Col>
          <Col className="p-0 my-4 d-flex justify-content-end">
            <Button variant="warning" className="d-flex gap-1"><Help></Help><p className="m-0">{t("create_own")}</p></Button>
          </Col>
        </Row>

        <Row className="w-75">
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

          <Col xxl="10">
          {filteredGroupedPallets.map((groupedPallet: GroupedPallet) => {
              const groupKey = groupedPallet.ids.join("-");

              const selectedQuality =
                selectedQualities[groupKey] ?? groupedPallet.qualities[0];

              const selectedQualityItem = groupedPallet.qualityItems.find(
                (item) => item.quality === selectedQuality
              );

              return (
                <Row
                  key={groupKey}
                  className="shadow p-3 mb-3 bg-body-tertiary rounded"
                >
                  <Col xl="3" className="border-end">
                    <Image
                      src={selectedQualityItem?.url ?? groupedPallet.qualityItems[0].url}
                      style={{ width: 144, height: 144, objectFit: "contain" }}
                      className="border border-2 rounded bg-white"
                    />
                  </Col>

                  <Col xl="3" className="border-end d-flex flex-column justify-content-evenly">
                    <p>{t(groupedPallet.name)}</p>

                    <p>
                      {groupedPallet.length} × {groupedPallet.width} ×{" "}
                      {groupedPallet.height} mm
                    </p>

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
                  </Col>

                  <Col xl="3" className="border-end d-flex flex-column justify-content-evenly">
                    {selectedQualityItem ? (
                      <>
                        <p>
                          <Group />{" "}
                          {stockSummaries[selectedQualityItem.id]?.sellerCount ?? 0}{" "}
                          {t("seller")}
                        </p>

                        <p>
                          <Sell />{" "}
                          {stockSummaries[selectedQualityItem.id]?.totalQuantity?.toLocaleString() ?? 0}{" "}
                          {t("immediately_available")}
                        </p>

                        <p>
                          <Euro />{" "}
                          {stockSummaries[selectedQualityItem.id]?.minPrice !== null &&
                          stockSummaries[selectedQualityItem.id]?.minPrice !== undefined
                            ? `${t("from")} € ${stockSummaries[selectedQualityItem.id].minPrice.toFixed(2)}`
                            : t("no_price_available")}
                        </p>
                      </>
                    ) : (
                      <p className="text-muted">{t("no_stock_available")}</p>
                    )}
                  </Col>

                  <Col className="d-flex flex-column justify-content-evenly" xl="3">
                    <Button
                      variant="outline-success"
                      onClick={() => {
                        const selectedPallet = myPallets.find(p => p.id === selectedQualityItem?.id);
                        setSelectedPallet(selectedPallet);
                        setShowAddPaletteModal(true);
                      }}
                    >
                      <AddShoppingCartIcon /> {t("add_to_cart")}
                    </Button>

                    <Button variant="outline-primary" href={`/pallet/${selectedQualityItem?.id}/stock`}>
                      <LocalShipping /> {t("who_sells_it")}
                    </Button>
                  </Col>
                </Row>
              );
            })}
          </Col>
        </Row>

        <Modal show={showAddPaletteModal} centered size="sm">

          <Modal.Header className="justify-content-center gap-1">
            <AddShoppingCartIcon color="success"></AddShoppingCartIcon>
            <Modal.Title>{t("add_pallet")}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <p className="text-center">{t(selectedPallet?.name)}<Badge className="ms-1">{t(selectedPallet?.quality)}</Badge></p>
              

              <FloatingLabel controlId="floatingQuantity" label="Quantity">
                <Form.Control type="number" placeholder="0" onChange={(e) => setSelectedQuantity(Number(e.target.value))}/>
              </FloatingLabel>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button className="w-100" variant="outline-danger">{t("cancel")}</Button>
            
            <Button className="w-100" variant="success" onClick={() => addPaletteToCart(selectedPallet, selectedQuantity)}>{t("add")}</Button>
          </Modal.Footer>

        </Modal>
      </main>
    </>
  );
}