import { Business, Person } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useAppContext } from "~/layouts/layout";
import type { Employee } from "~/types";

export default function Profile() {

    const apiUrl=import.meta.env.VITE_API_URL;
    const [authenticated, setAuthenticated, paletteInCart, setPaletteInCart] = useAppContext();
    const [myProfile, setMyProfile] = useState<Employee>();


    const getProfile = async () => {
        try {

            const response = await fetch(`${apiUrl}/v1/auth/profile`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setAuthenticated(true);
                setMyProfile(data);
                console.log(data)
            }

        } catch (error) {
            console.log(error)
        }

    };


    useEffect(()=>{
        getProfile();
    }, [])


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
                    <Accordion.Item eventKey="profile">
                        <Accordion.Header><Person></Person> Profile</Accordion.Header>
                        <Accordion.Body><p>This is employee profile</p></Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="company">
                        <Accordion.Header><Business></Business>Company</Accordion.Header>
                        <Accordion.Body><p>This is company profile</p></Accordion.Body>
                    </Accordion.Item>

                </Accordion>
            </main>
        </>
    );
}
