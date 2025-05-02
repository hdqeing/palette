import { Button } from "react-bootstrap"
import { Link } from "react-router-dom"

export default function Cart() {
    return (
        <>
            <h1>Einkaufswagen</h1>
            <ul>
                <li>Europalette</li>
                <li>Einwegpalette</li>
                <li>Chemiepalette</li>
            </ul>
            <Button>
                zurück
            </Button>
            <Button variant="light">
                <Link to={'/supplier'}>
                    Lieferand aussuchen
                </Link>
            </Button>
        
        </>
    )
}