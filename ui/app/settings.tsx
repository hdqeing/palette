import { Breadcrumb, Form } from "react-bootstrap";

export default function NotificationPage(){
    return (
        <>
        <Breadcrumb className="m-3">
        <Breadcrumb.Item>Palletly</Breadcrumb.Item>
        <Breadcrumb.Item active>Settings</Breadcrumb.Item>
        </Breadcrumb>

        <Form className="m-3">
            <Form.Check // prettier-ignore
            type="switch"
            id="custom-switch"
            label="Email Notification when receiving new request for quotes"
            />
        </Form>
        </>
    )
}
