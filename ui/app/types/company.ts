export interface Company {
    id: number,
    title: string,
    street: string,
    houseNumber: string,
    postalCode: string,
    city: string,
    homepage: string,
    vat: string,
    verified: boolean,
    germanyPickUp: boolean,
    euPickUp: boolean,
    germanyDeliver: boolean,
    seller: boolean,
    shipping: boolean,
    euDeliver: boolean
}