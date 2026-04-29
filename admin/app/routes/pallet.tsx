import { useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import {
    Col,
    Container,
    Row,
    Button,
    InputGroup,
    Form,
    Image,
    Badge
} from "react-bootstrap";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import type { PalletSort } from "~/types";

type Pallet = {
    id: number;
    quality: string;
    url: string;
};

type PalletSortWithPallets = PalletSort & {
    pallets: Pallet[];
};

export default function PalletPage() {
    const authenticated = useOutletContext<boolean>();
    const apiUrl = import.meta.env.VITE_API_URL;

    const [palletSorts, setPalletSorts] = useState<PalletSortWithPallets[]>([]);

    const getPreferredPhoto = (pallets?: Pallet[]): string | null => {
        const qualityOrder = ["NEW", "CLASS A", "CLASS B", "CLASS C"];

        for (const quality of qualityOrder) {
            const pallet = (pallets ?? []).find((p) => p.quality === quality && p.url);
            if (pallet) {
                return pallet.url;
            }
        }

        return null;
    };

    const getAvailableQualities = (pallets?: Pallet[]): string[] => {
        const qualityOrder = ["NEW", "CLASS A", "CLASS B", "CLASS C"];

        return qualityOrder.filter((quality) =>
            (pallets ?? []).some((p) => p.quality === quality)
        );
    };

    const getBadgeProps = (quality: string): { bg: string; text?: string } => {
        switch (quality) {
            case "NEW":
                return { bg: "success" };
            case "CLASS A":
                return { bg: "primary" };
            case "CLASS B":
                return { bg: "warning", text: "dark" };
            case "CLASS C":
                return { bg: "secondary" };
            default:
                return { bg: "dark" };
        }
    };

    const getPalletSorts = async () => {
        try {
            const response = await fetch(`${apiUrl}/v1/pallets/sorts`, {
                credentials: "include"
            });

            if (!response.ok) {
                return;
            }

            const sorts: PalletSort[] = await response.json();

            const sortsWithPallets = await Promise.all(
                sorts.map(async (sort) => {
                    try {
                        const palletsResponse = await fetch(
                            `${apiUrl}/v1/pallets/sort/${sort.id}/pallets`,
                            {
                                credentials: "include"
                            }
                        );

                        let pallets: Pallet[] = [];

                        if (palletsResponse.ok) {
                            pallets = await palletsResponse.json();
                        }

                        return {
                            ...sort,
                            pallets: pallets ?? []
                        };
                    } catch {
                        return {
                            ...sort,
                            pallets: []
                        };
                    }
                })
            );

            setPalletSorts(sortsWithPallets);
        } catch (error) {
            console.error("Failed to load pallet sorts", error);
        }
    };

    useEffect(() => {
        getPalletSorts();
    }, []);

    if (!authenticated) {
        return <p>You are not authenticated! Please login to see more!</p>;
    }

    return (
        <Container className="d-flex flex-column gap-4">
            <Row>
                <Col xxl={10}>
                    <InputGroup className="mb-3">
                        <Form.Control placeholder="Search for pallet sorts" />
                        <Button
                            variant="outline-secondary"
                            id="button-addon2"
                            className="d-flex justify-content-center align-items-center gap-1"
                        >
                            <SearchIcon />
                            <p className="m-0">Search</p>
                        </Button>
                    </InputGroup>
                </Col>

                <Col xxl={2}>
                    <Button
                        className="w-100 d-flex justify-content-center align-items-center gap-1"
                        variant="outline-primary"
                    >
                        <AddIcon />
                        <p className="m-0">Add new pallet sort</p>
                    </Button>
                </Col>
            </Row>

            {palletSorts.map((palletSort) => {
                const photoUrl = getPreferredPhoto(palletSort.pallets);
                const qualities = getAvailableQualities(palletSort.pallets);

                return (
                    <Row
                        key={palletSort.id}
                        className="shadow p-3 bg-body-tertiary rounded align-items-center"
                    >
                        <Col xxl={2} className="d-flex justify-content-center">
                            {photoUrl ? (
                                <Image
                                    src={photoUrl}
                                    alt={palletSort.name}
                                    rounded
                                    fluid
                                    style={{
                                        maxHeight: "100px",
                                        width: "100%",
                                        objectFit: "cover"
                                    }}
                                />
                            ) : (
                                <div
                                    className="d-flex justify-content-center align-items-center border rounded w-100"
                                    style={{ height: "100px" }}
                                >
                                    <p className="m-0 text-muted">No photo</p>
                                </div>
                            )}
                        </Col>

                        <Col xxl={3}>
                            <p className="mb-0 fw-semibold">{palletSort.name}</p>
                        </Col>

                        <Col xxl={2}>
                            <p className="mb-0">
                                {palletSort.length} x {palletSort.width} x {palletSort.height}
                            </p>
                        </Col>

                        <Col xxl={3}>
                            <div className="d-flex flex-wrap gap-2">
                                {qualities.length > 0 ? (
                                    qualities.map((quality) => {
                                        const badgeProps = getBadgeProps(quality);

                                        return (
                                            <Badge
                                                key={`${palletSort.id}-${quality}`}
                                                pill
                                                bg={badgeProps.bg}
                                                text={badgeProps.text}
                                            >
                                                {quality}
                                            </Badge>
                                        );
                                    })
                                ) : (
                                    <Badge pill bg="light" text="dark">
                                        No qualities
                                    </Badge>
                                )}
                            </div>
                        </Col>

                        <Col xxl={1} className="d-flex justify-content-start">
                            <Button variant="outline-success">
                                <EditOutlinedIcon />
                            </Button>
                        </Col>

                        <Col xxl={1} className="d-flex justify-content-end">
                            <Button variant="outline-danger">
                                <DeleteOutlineOutlinedIcon />
                            </Button>
                        </Col>
                    </Row>
                );
            })}
        </Container>
    );
}