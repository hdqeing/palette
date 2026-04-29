import { Badge, Breadcrumb, Button, Card, Carousel, Col, FloatingLabel, Form, Image, Modal, Row } from "react-bootstrap";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useRef, useState } from "react";

interface Photo {
    id: number;
    blobName: string;
};

interface Company {
    id: number;
    title: string;
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    homepage: string;
    vat: string;
    verified: boolean;
    germanyPickUp: boolean;
    euPickUp: boolean;
    germanyDeliver: boolean;
    seller: boolean;
    shipping: boolean;
    euDeliver: boolean;
}

interface Sort {
    id: number;
    name: string;
    length: number;
    width: number;
    height: number;
    owner: Company | null;
    private: boolean;
}

interface Pallet {
    id: number;
    sort: Sort;
    quality: string;
    url: string;
}

interface Stock {
    id: number;
    quantity: number;
    price: number;
    company: Company;
    pallet: Pallet;
    photos: Array<Photo>;
}

export default function ProductPage(){

    const [stocks, setStocks] = useState([]);
    const [allPallets, setAllPallets] = useState<Pallet[]>([]);
    const [selectedSort, setSelectedSort] = useState<string>('');
    const [selectedQuality, setSelectedQuality] = useState<string>('');
    const [selectedPallet, setSelectedPallet] = useState<Pallet>();
    const [showModalAddStock, setShowModalAddStock] = useState(false);
    const photoUploadRef = useRef(null)
    const [uploadedPhoto, setUploadedPhoto] = useState<Photo>();
    const [photoUploaded, setPhotoUploaded] = useState(false);
    const [stockPalletSort, setStockPalletSort] = useState('');
    const [stockPalletQuality, setStockPalletQuality] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [stockPrice, setStockPrice] = useState('');
    const API_URL = import.meta.env.VITE_API_URL;

    const updateSelectedPallet = () => {
        console.log(selectedQuality)
        console.log(selectedSort)
        console.log(allPallets.find(pallet => pallet.sort.name === selectedSort && pallet.quality === selectedQuality))
        setSelectedPallet(allPallets.find(pallet => pallet.sort.name === selectedSort && pallet.quality === selectedQuality))

    }

    const fetchAllPallets = async () => {
        
        try {
            const response = await fetch("http://localhost:8080/v1/pallets")

            if (response.ok) {
                const data = await response.json();
                setAllPallets(data);
            }

        } catch (error) {
            console.error(error)

        }


    }

    const fetchStocks = async () => {

        try {
            const response = await fetch("http://localhost:8080/v1/stocks",{
                method: "GET",
                credentials: "include"
            })

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const result = await response.json();
            setStocks(result);

        } catch (error) {
            console.error(error)
        }

        

    }

    const handleUploadPhotoButtonClick = () => {
        if (photoUploadRef.current) {
            photoUploadRef.current.click();
        }
    }

    const handlePhotoUpload = async (e) => {
        const file = e.target.files?.[0];
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await fetch(`${API_URL}/v1/photos`, {
                method: "POST",
                credentials: "include",
                body: formData
            })

            if (!response.ok) {
                console.log("An error occurred!")
            } else {
                const photo = await response.json()
                setPhotoUploaded(true);
                setUploadedPhoto({
                    id: photo.id,
                    blobName: photo.blobName,
                });
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    const handleCreateStock = async () => {
        try {
            const response = await fetch(`${API_URL}/v1/stocks`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    paletteId: selectedPallet?.id,
                    quantity: stockQuantity,
                    price: stockPrice,
                    photoIds: [uploadedPhoto?.id],
                })
            })

        } catch (error) {
            console.error(error.message)
        }

    }

    useEffect(() =>  {
        fetchStocks()

    }, [])

    return (
        <>
        <Breadcrumb className="m-3">
        <Breadcrumb.Item>Palletly</Breadcrumb.Item>
        <Breadcrumb.Item active>Product</Breadcrumb.Item>
        </Breadcrumb>

        <div className="m-3 justify-between flex flex-col">

        <div>
            <Row className="mb-3">
                <Col>
                    <h4>Pallet</h4>
                </Col>
                
                <Col>
                    <h4>Quality</h4>
                </Col>
                
                <Col>
                    <h4>Quantity</h4>
                </Col>
                
                <Col>
                    <h4>Price</h4>
                </Col>

                <Col></Col>

            </Row>
            {stocks.map((stock : Stock) => {
                return (
                <Row className="mb-3">
                    <Col>
                        <h4>{stock.pallet.sort.name}</h4>
                    </Col>
                    
                    <Col>
                        <Badge bg="success">{stock.pallet.quality}</Badge>
                    </Col>
                    
                    <Col>
                        <p>{stock.quantity}</p>
                    </Col>
                    
                    <Col>
                        <p>{stock.price}</p>
                    </Col>

                    <Col className="d-flex justify-content-end gap-3">
                    <Button variant="outline-primary"><EditIcon></EditIcon></Button>
                    <Button variant="outline-danger"><DeleteIcon></DeleteIcon></Button>
                    
                    </Col>

                </Row>
                )
            })}
                        <Row className="mb-3">
                <Col>
                </Col>
                
                <Col>
                </Col>
                
                <Col>
                </Col>
                
                <Col>
                </Col>

                <Col className="flex justify-end">
                        <Button variant="outline-success" onClick={() => {setShowModalAddStock(true)}}>
                            <AddIcon />Add New Pallet
                        </Button>

                </Col>

            </Row>
        </div>


        </div>

        <Modal show={showModalAddStock} centered size="lg" onShow={fetchAllPallets}>
            <Modal.Header className="justify-content-center">
                <Modal.Title>Lagebestand hinzufuegen</Modal.Title>
            </Modal.Header>

            <Modal.Body className="d-flex flex-column gap-3">
                <Row>
                    <Col>
                        <FloatingLabel label="Palette">
                            <Form.Select onChange={(e) => {setSelectedSort(e.target.value); updateSelectedPallet()}}>
                                {
                                    [... new Set(allPallets.map(pallet => pallet.sort.name))].map((name) => {
                                        return (<option>{name}</option>)
                                    })
                                }
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel label="Qualitaet">
                            <Form.Select onChange={(e) => {setSelectedQuality(e.target.value); updateSelectedPallet()}}>
                                {
                                    [... new Set(allPallets.map(pallet => pallet.quality))].map((quality) => {
                                        return (<option value={quality}>{quality}</option>)
                                    })
                                }
                            </Form.Select>
                        </FloatingLabel>
                    </Col>
                </Row>


                <Row>
                    <Col>
                        <FloatingLabel label="Anzahl">
                            <Form.Control type="number" onChange={(e) => {setStockQuantity(e.target.value)}}></Form.Control>
                        </FloatingLabel>
                    </Col>

                    <Col>
                        <FloatingLabel label="Price">
                            <Form.Control type="number" onChange={(e) => {setStockPrice(e.target.value)}}></Form.Control>
                        </FloatingLabel>
                    </Col>
                </Row>



                <Row>
                    <Col>
                        <Button variant="outline-secondary" className="w-100 p-0" style={{ aspectRatio: "1" }} onClick={handleUploadPhotoButtonClick}>
                            {photoUploaded ? (<Image src={`https://palletly.blob.core.windows.net/pallet-images/${uploadedPhoto?.blobName}`}></Image>) : <AddIcon style={{ width: "100%", height: "100%" }}/>}
                        </Button>
                        <Form.Control type="file" style={{ display: "none" }} ref={photoUploadRef} onChange={handlePhotoUpload}></Form.Control>
                    </Col>

                    <Col>
                        <Button variant="outline-secondary" className="w-100 p-0" style={{ aspectRatio: "1" }}>
                            <AddIcon style={{ width: "100%", height: "100%" }}/>
                        </Button>                                    
                    </Col>

                    <Col>
                        <Button variant="outline-secondary" className="w-100 p-0" style={{ aspectRatio: "1" }}>
                            <AddIcon style={{ width: "100%", height: "100%" }}/>
                        </Button>                                    
                    </Col>
                </Row>

            </Modal.Body>

            <Modal.Footer className="justify-content-between">
                <Button variant="outline-danger" onClick={() => {setShowModalAddStock(false)}}>Abbrechen</Button>
                <Button variant="success" onClick={handleCreateStock}>Speichern</Button>
            </Modal.Footer>

        </Modal>
        
        </>
    )
}