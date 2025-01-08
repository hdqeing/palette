import { Form, Row, Col, Button, FloatingLabel } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = async (username, password) => {
        await fetch('http://localhost:8080/login', {
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
        login(username, password)
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

            <p>If you do not have an account, click here to <Link to={'/register'}>register</Link>.</p>

            <Button type="submit">
                Login
            </Button>

        </Form>
    )
}