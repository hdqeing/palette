import { Business, Person, Verified } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Accordion, Alert, Button, Col, FloatingLabel, Form, InputGroup, Modal, Row, Toast, ToastContainer } from "react-bootstrap";
import { useAppContext } from "~/layouts/layout";
import type { Company, Employee } from "~/types";
import type { Route } from "./+types/profile";
import { Form as RRForm } from "react-router";
import { useTranslation } from "react-i18next";

const apiUrl=import.meta.env.VITE_API_URL;

export async function clientLoader(){
    const response = await fetch(`${apiUrl}/v1/auth/profile`, {
        credentials: 'include'
    });

    const profile = await response.json();

    const companyResponse = await fetch(`${apiUrl}/v1/companies`);
    const companies = await companyResponse.json();

    return {profile, companies};
}

export async function clientAction({request}: Route.ClientActionArgs){
    let formData = await request.formData();
    const intent = formData.get("intent");

    if (intent === "profile") {
        let response = await fetch(`${apiUrl}/v1/employee/${formData.get('id')}`, {
            method: "PUT",
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                firstName: formData.get('firstname'),
                lastName: formData.get('lastname'),
            }),
        });
        if (!response.ok) return { intent: "profile", error: await response.text() };
        return { intent: "profile", success: true };
    }

    if (intent === "company") {
        let response = await fetch(`${apiUrl}/v1/company/${formData.get('companyId')}`, {
            method: "PUT",
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title: formData.get('title'),
                street: formData.get('street'),
                houseNumber: formData.get('houseNumber'),
                postalCode: formData.get('postalCode'),
                city: formData.get('city'),
                homepage: formData.get('homepage'),
                vat: formData.get('vat'),
            }),
        });
        if (!response.ok) return { intent: "company", error: await response.text() };
        return { intent: "company", success: true };
    }

    if (intent === "join") {
        let response = await fetch(`${apiUrl}/v1/employee/${formData.get('employeeId')}`, {
            method: "PUT",
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                companyId: formData.get('companyId'),
            }),
        });
        if (!response.ok) return { intent: "join", error: await response.text() };
        return { intent: "join", success: true };
    }

    if (intent === "create") {
        let response = await fetch(`${apiUrl}/v1/company`, {
            method: "POST",
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title:       formData.get('title'),
                street:      formData.get('street'),
                houseNumber: formData.get('houseNumber'),
                postalCode:  formData.get('postalCode'),
                city:        formData.get('city'),
                homepage:    formData.get('homepage'),
                vat:         formData.get('vat'),
            }),
        });
        if (!response.ok) return { intent: "create", error: await response.text() };
        return { intent: "create", success: true };
    }
}


export default function Profile({loaderData, actionData} : Route.ComponentProps) {

    const { profile, companies } = loaderData;
    const { t } = useTranslation();

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError]     = useState(false);
    const [showJoinModal, setShowJoinModal]     = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company>(companies[0]);

    const handleCompanyChange = (companyId: Number) => {
        setSelectedCompany(companies.find(company => company.id === companyId))
    }

    useEffect(() => {
        if (actionData?.success) {
            setShowSuccess(true);
            // close modals on success
            setShowJoinModal(false);
            setShowCreateModal(false);
        }
        if (actionData?.error) setShowError(true);
    }, [actionData]);

    const successMessage = () => {
        switch (actionData?.intent) {
            case "company": return t("company_saved");
            case "join":    return t("join_company_success");
            case "create":  return t("create_company_success");
            default:        return t("profile_saved");
        }
    };

    return (
        <>
            <div
                style={{ backgroundColor: "burlywood" }}
                className="d-flex justify-content-center vw-100"
            >
                <nav aria-label="breadcrumb" className="w-75 p-2">
                    <ol className="breadcrumb m-0">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item active">Profile</li>
                    </ol>
                </nav>
            </div>

            <main className="d-flex flex-column align-items-center gap-2">
                <Accordion defaultActiveKey={["profile", "company"]} className="w-75 mt-4" alwaysOpen>

                    {/* ── Personal Profile ────────────────────────────── */}
                    <Accordion.Item eventKey="profile">
                        <Accordion.Header><Person />{t("profile")}</Accordion.Header>
                        <Accordion.Body>
                            <Form as={RRForm} method="post" className="d-flex flex-column gap-2">
                                <Form.Control name="intent" defaultValue="profile" hidden />
                                <Form.Control name="id" defaultValue={profile.id} hidden />

                                <FloatingLabel label={t("email")}>
                                    <Form.Control name="email" defaultValue={profile.email} disabled />
                                </FloatingLabel>

                                <Row>
                                    <Col>
                                        <FloatingLabel label={t("firstname")}>
                                            <Form.Control name="firstname" defaultValue={profile.firstName} />
                                        </FloatingLabel>
                                    </Col>

                                    <Col>
                                        <FloatingLabel label={t("lastname")}>
                                            <Form.Control name="lastname" defaultValue={profile.lastName} />
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <Button type="submit" variant="success">{t("save_profile")}</Button>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>

                    {/* ── Company ─────────────────────────────────────── */}
                    <Accordion.Item eventKey="company">
                        <Accordion.Header><Business />{t("company")}</Accordion.Header>
                        <Accordion.Body>
                            {profile.company === null ? (
                                <div className="d-flex flex-column gap-3">
                                    <p className="text-muted m-0">{t("msg_no_company")}</p>
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="outline-success"
                                            className="w-50"
                                            onClick={() => setShowJoinModal(true)}
                                        >
                                            {t("join_company")}
                                        </Button>
                                        <Button
                                            variant="success"
                                            className="w-50"
                                            onClick={() => setShowCreateModal(true)}
                                        >
                                            {t("create_company")}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Form as={RRForm} method="post" className="d-flex flex-column gap-2">
                                    <Form.Control name="intent"    defaultValue="company"               hidden />
                                    <Form.Control name="companyId" defaultValue={profile.company.id}  hidden />

                                    <FloatingLabel label={t("company_name")}>
                                        <Form.Control name="title" defaultValue={profile.company.title} />
                                    </FloatingLabel>

                                    <Row>
                                        <Col>
                                            <FloatingLabel label={t("street")}>
                                                <Form.Control name="street" defaultValue={profile.company.street} />
                                            </FloatingLabel>
                                        </Col>
                                        <Col xs="3">
                                            <FloatingLabel label={t("house_number")}>
                                                <Form.Control name="houseNumber" defaultValue={profile.company.houseNumber} />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col xs="4">
                                            <FloatingLabel label={t("postal_code")}>
                                                <Form.Control name="postalCode" defaultValue={profile.company.postalCode} />
                                            </FloatingLabel>
                                        </Col>
                                        <Col>
                                            <FloatingLabel label={t("city")}>
                                                <Form.Control name="city" defaultValue={profile.company.city} />
                                            </FloatingLabel>
                                        </Col>
                                    </Row>

                                    <FloatingLabel label={t("homepage")}>
                                        <Form.Control name="homepage" defaultValue={profile.company.homepage} />
                                    </FloatingLabel>

                                    <FloatingLabel label={t("vat")}>
                                        <Form.Control name="vat" defaultValue={profile.company.vat} />
                                    </FloatingLabel>

                                    <Button type="submit" variant="success">{t("save_company_profile")}</Button>
                                </Form>
                            )}
                        </Accordion.Body>
                    </Accordion.Item>

                </Accordion>
            </main>

            {/* ── Join Company Modal ───────────────────────────────────── */}
            <Modal show={showJoinModal} centered onHide={() => setShowJoinModal(false)}>
                <Modal.Header className="justify-content-center">
                    <Modal.Title>{t("join_company")}</Modal.Title>
                </Modal.Header>
                <Form as={RRForm} method="post">
                    <Modal.Body className="d-flex flex-column gap-2">
                        <Form.Control name="intent" defaultValue="join" hidden />
                        <Form.Control name="employeeId" defaultValue={profile.id} hidden />
                        <Form.Control name="companyId" value={selectedCompany.id} hidden />
                        <FloatingLabel label={t('company')}>
                            <Form.Select onChange={(e) => handleCompanyChange(Number(e.target.value))}>
                                {
                                    companies.map((company: Company) => (<option value={company.id}>{company.title}</option>))
                                }
                            </Form.Select>
                        </FloatingLabel>

                        <InputGroup>
                            <FloatingLabel label={t('vat')}>
                                <Form.Control value={selectedCompany.vat} disabled></Form.Control>
                            </FloatingLabel>

                            <Button variant="outline-secondary" disabled><Verified color={selectedCompany.verified? "success" : "disabled"}></Verified></Button>
                        </InputGroup>

                        <Row>
                            <Col xs="8">
                                <FloatingLabel label={t('street')}>
                                    <Form.Control value={selectedCompany.street} disabled></Form.Control>
                                </FloatingLabel>
                            </Col>                            

                            <Col xs="4">
                                <FloatingLabel label={t('nr')}>
                                    <Form.Control value={selectedCompany.houseNumber} disabled></Form.Control>
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <FloatingLabel label={t('postal_code')}>
                                    <Form.Control value={selectedCompany.postalCode} disabled></Form.Control>
                                </FloatingLabel>
                            </Col>                            

                            <Col>
                                <FloatingLabel label={t('city')}>
                                    <Form.Control value={selectedCompany.city} disabled></Form.Control>
                                </FloatingLabel>
                            </Col>
                        </Row>

                        {actionData?.intent === "join" && actionData?.error && (
                            <Alert variant="danger" className="m-0">{actionData.error}</Alert>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Col>
                            <Button className="w-100" variant="outline-danger" onClick={() => setShowJoinModal(false)}>{t("cancel")}</Button>
                        </Col>

                        <Col>
                            <Button className="w-100" variant="success" type="submit">{t("join")}</Button>                
                        </Col>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* ── Create Company Modal ─────────────────────────────────── */}
            <Modal show={showCreateModal} centered onHide={() => setShowCreateModal(false)}>
                <Modal.Header className="justify-content-center">
                    <Modal.Title>{t("create_company")}</Modal.Title>
                </Modal.Header>
                <Form as={RRForm} method="post">
                    <Modal.Body className="d-flex flex-column gap-2">
                        <Form.Control name="intent" defaultValue="create" hidden />

                        <FloatingLabel label={t("company_name")}>
                            <Form.Control name="title" />
                        </FloatingLabel>

                        <Row>
                            <Col>
                                <FloatingLabel label={t("street")}>
                                    <Form.Control name="street" />
                                </FloatingLabel>
                            </Col>
                            <Col xs="3">
                                <FloatingLabel label={t("house_number")}>
                                    <Form.Control name="houseNumber" />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs="4">
                                <FloatingLabel label={t("postal_code")}>
                                    <Form.Control name="postalCode" />
                                </FloatingLabel>
                            </Col>
                            <Col>
                                <FloatingLabel label={t("city")}>
                                    <Form.Control name="city" />
                                </FloatingLabel>
                            </Col>
                        </Row>

                        <FloatingLabel label={t("homepage")}>
                            <Form.Control name="homepage" />
                        </FloatingLabel>

                        <FloatingLabel label={t("vat")}>
                            <Form.Control name="vat" />
                        </FloatingLabel>

                        {actionData?.intent === "create" && actionData?.error && (
                            <Alert variant="danger" className="m-0">{actionData.error}</Alert>
                        )}
                    </Modal.Body>
                    <Modal.Footer className="justify-content-between">
                        <Button className="w-25" variant="outline-danger" onClick={() => setShowCreateModal(false)}>{t("cancel")}</Button>
                        <Button className="w-25" variant="success" type="submit">{t("create")}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* ── Toasts ───────────────────────────────────────────────── */}
            <ToastContainer position="middle-center">
                <Toast bg="success" autohide delay={3000} show={showSuccess} onClose={() => setShowSuccess(false)}>
                    <Toast.Header closeButton={false} className="justify-content-center">
                        <h6 className="m-0">{successMessage()}</h6>
                    </Toast.Header>
                </Toast>

                <Toast bg="danger" autohide delay={4000} show={showError} onClose={() => setShowError(false)}>
                    <Toast.Header closeButton={false} className="justify-content-center">
                        <h6 className="m-0">{actionData?.error}</h6>
                    </Toast.Header>
                </Toast>
            </ToastContainer>
        </>
    );
}