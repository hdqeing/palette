import { Container, Row, Col, Image, Table } from "react-bootstrap"
import { Link } from "react-router-dom"
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { SvgIcon } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

function renderStars(rating) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(
          <SvgIcon component={StarIcon} key={i} style={{ color: "gold" }} />
        );
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        stars.push(
          <SvgIcon
            component={StarIcon}
            key={i}
            style={{ color: "gold", opacity: 0.5 }}
          />
        );
      } else {
        stars.push(
          <SvgIcon component={StarBorderIcon} key={i} style={{ color: "gray" }} />
        );
      }
    }
    return stars;
  }

export default function SellerProfile() {

    const company = {
        name: "Holzminden Paletten GmbH",
        image: "https://freiheit-moebelstudio.de/thumbnail/44/28/00/1621239362/palette-epal3-ispm15-ippc-industriepalette-100x120-palettenmoebel-freiheit-seite-0990_1920x1920.jpg",
        address: {
          street: "Lange Strasse",
          postalCode: "37073",
          city: "Goettingen"
        },
        email: "palette@web.de",
        phone: "+491234567",
        rating: 4.2, 
    };


    return (
        <Container>
        <Row>
          <Col>
            <h1>{company.name}</h1>
            <div>{renderStars(company.rating)} <span>({company.rating} of 5)</span></div>

          </Col>
          <Col>
            <Image src={company.image} fluid />
          </Col>
        </Row>
        <Row>
          <Col>
            <Table>
              <tbody>
                <tr>
                  <td>
                    <SvgIcon component={MapOutlinedIcon} />
                  </td>
                  <td>
                    {company.address.street}
                    <br />
                    {company.address.postalCode}, {company.address.city}
                  </td>
                </tr>
                <tr>
                  <td>
                    <SvgIcon component={EmailOutlinedIcon} />
                  </td>
                  <td>{company.email}</td>
                </tr>
                <tr>
                  <td>
                    <SvgIcon component={PhoneOutlinedIcon} />
                  </td>
                  <td>{company.phone}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
          <Col>
          </Col>
        </Row>
      </Container>
    )
}