import React, { useEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap";
import londonJeans from "../assets/london_jeans.jpg"
import pennyUtility from "../assets/penny_utility_pants.jpg"
import maxiDress from "../assets/field_of_dreams_maxi_dress.jpg"
import sneakers from "../assets/cloud_6_sneakers.jpg"
import tankDress from "../assets/catch_a_wave_tank_dress.jpg"
import { votingApi } from "../api";


let inOrderRankings = [{
    name: "London Jeans",
    votes: 1000000,
    img: londonJeans,
    url: "https://www.shopbop.com/london-jean-slvrlake/vp/v=1/1581634060.htm"
}, {
    name: "Field of Dreams Maxi Dress",
    votes: 98600,
    img: maxiDress,
    url: "https://www.shopbop.com/field-dreams-maxi-lioness/vp/v=1/1505575879.htm"
}, {
    name: "Cloud 6 Sneakers",
    votes: 97654,
    img: sneakers,
    url: "https://www.shopbop.com/cloud-on/vp/v=1/1583265054.htm"
}, {
    name: "Catch a Wave Tank Dress",
    votes: 89976,
    img: tankDress,
    url: "https://www.shopbop.com/catch-wave-tank-dress-le/vp/v=1/1542786671.htm"
}, {
    name: "Penny Utility Pants",
    votes: 78654,
    img: pennyUtility,
    url: "https://www.shopbop.com/penny-utility-pistola-denim/vp/v=1/1552384691.htm"
}]

function CrowdbopRankings() {
    const [rankingsData, setRankingsData] = useState([]);
    useEffect(() => {
        const fetchLeaderboard = async () => {
            const initializeDb = await votingApi.initialize();
            console.log("Initialize:", initializeDb);   
            const rankings = await votingApi.fetchVotePair();
            setRankingsData(rankings);
            console.log("Rankings:", rankings);
        }
        fetchLeaderboard();
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
                    <h2>#Votes</h2>
                </Col>
            </Row>
            <hr />
            {inOrderRankings.map((item, index) => {
                return <>
                    <Row key={index} style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                        <Col xs={4} className="d-flex align-items-center justify-content-center">
                            <h3 className="text-center">{index + 1}</h3>
                        </Col>
                        <Col xs={4}>
                            <a href={item.url} className="d-flex align-items-center justify-content-center">
                                <img src={item.img} alt={item.name} style={{ marginRight: "10px", width: "100px" }} />
                                <h3 className="mb-0">{item.name}</h3>
                            </a>
                        </Col>
                        <Col xs={4} className="d-flex align-items-center justify-content-center">
                            <h3 className="text-center">{item.votes}</h3>
                        </Col>
                    </Row>
                    {index == inOrderRankings.length - 1 ? "" : <hr />}
                </>
            })}
        </Container>
    </>
}

export default CrowdbopRankings;
