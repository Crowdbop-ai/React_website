import React, { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap";
import londonJeans from "../assets/london_jeans.jpg"
import pennyUtility from "../assets/penny_utility_pants.jpg"
import maxiDress from "../assets/field_of_dreams_maxi_dress.jpg"
import sneakers from "../assets/cloud_6_sneakers.jpg"
import tankDress from "../assets/catch_a_wave_tank_dress.jpg"

const imgBaseURL = "https://m.media-amazon.com/images/G/01/Shopbop/p"
const itemBaseURL = "https://www.shopbop.com/"

function CrowdbopRankings() {

    const [rankingsData, setRankingsData] = useState([]);

    useEffect(() => {
        fetch("https://s5g4aq9wn1.execute-api.us-east-2.amazonaws.com/prod/leaderboard")
        .then(res => res.json())
        .then(data => {
            setRankingsData(data.leaderboard);
            console.log(data.leaderboard);
        })
    }, []);

    return <>
        <h1>TOP RANKED PRODUCTS</h1>
        <Container fluid style={{ marginTop: "2rem" }}>
            <Row>
                <Col xs={4}>
                    <h2>Ranking</h2>
                </Col>
                <Col xs={4}>
                    <h2>Item</h2>
                </Col>
                <Col xs={4}>
                    <h2>Elo</h2>
                </Col>
            </Row>
            <hr />
            {rankingsData ? rankingsData.map((item, index) => {
                return (
                    <React.Fragment key={index}>
                        <Row style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                            <Col xs={4} className="d-flex align-items-center justify-content-center">
                                <h3 className="text-center">{index + 1}</h3>
                            </Col>
                            <Col xs={4}>
                                <a href={itemBaseURL + item.ProductDetailURL} className="d-flex align-items-center justify-content-center">
                                    <img src={imgBaseURL + item.PrimaryImageURL} alt={item.ProductName} style={{ marginRight: "10px", width: "150px" }} />
                                    <h3 className="mb-0">{item.ProductName}</h3>
                                </a>
                            </Col>
                            <Col xs={4} className="d-flex align-items-center justify-content-center">
                                <h3 className="text-center">{item.EloRating}</h3>
                            </Col>
                        </Row>
                        {index === rankingsData.length - 1 ? "" : <hr />}
                    </React.Fragment>
                )
            }) : <h2 style={{ marginTop: "1%" }}>Article Loading ...</h2>}
        </Container>
    </>
}

export default CrowdbopRankings;
