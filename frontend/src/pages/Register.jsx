import { Form, Row, Col, Button, FloatingLabel } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
/*     const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [vat, setVat] = useState('');
    const [street, setStreet] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
 */

    const registerUser = async (username, password) => {
        await fetch('http://localhost:8080/register', {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        })
        .catch((err) => {
            console.log(err.message);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        registerUser(username, password)
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FloatingLabel
                controlId="inputUsername"
                label="Username"
                className="mb-3"
            >
                <Form.Control
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </FloatingLabel>

            <FloatingLabel
                controlId="inputPassword"
                label="Password"
                className="mb-3"
            >
                <Form.Control
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </FloatingLabel>

            <p>If you already have an account, click here to <Link to={'/login'}>login</Link>.</p>

            <Button type="submit">
                Register
            </Button>

        </Form>
    )
}