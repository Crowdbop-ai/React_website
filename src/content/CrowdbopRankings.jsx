import React, { useEffect, useState } from "react"
import { Col, Container, Row, Button, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";

const imgBaseURL = "https://m.media-amazon.com/images/G/01/Shopbop/p"
const itemBaseURL = "https://www.shopbop.com/"

function CrowdbopRankings() {

    const [rankingsData, setRankingsData] = useState([]);
    const [page, setPage] = useState(1);

    const handleNext = () => {
        setPage((p) => p + 1);
    }
    const handlePrev = () => {
        setPage((p) => p - 1);
    }

    useEffect(() => {
        fetch("https://s5g4aq9wn1.execute-api.us-east-2.amazonaws.com/prod/leaderboard?limit=10&offset=" + (page - 1) * 10)
            .then(res => res.json())
            .then(data => {
                setRankingsData(data.leaderboard);
            })
    }, [page]);

    return <>
    <h1 style={{ color: "#E85C41" }}>
        <Link to="/" style={{ color: "#E85C41", textDecoration: "none" }}>CrowdBop</Link>
    </h1>
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
                    <h2>Wins</h2>
                </Col>
            </Row>
            <hr />
            {rankingsData ? rankingsData.map((item, index) => {
                return (
                    <React.Fragment key={index}>
                        <Row style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                            <Col xs={4} className="d-flex align-items-center justify-content-center">
                                <h3 className="text-center">{item.rank}</h3>
                            </Col>
                            <Col xs={4}>
                                <a href={itemBaseURL + item.ProductDetailURL} className="d-flex align-items-center justify-content-center">
                                    <img src={imgBaseURL + item.PrimaryImageURL} alt={item.ProductName} style={{ marginRight: "10px", width: "150px" }} />
                                    <h3 className="mb-0">{item.ProductName}</h3>
                                </a>
                            </Col>
                            <Col xs={4} className="d-flex align-items-center justify-content-center">
                                <h3 className="text-center">{item.Wins}</h3>
                            </Col>
                        </Row>
                        {index === rankingsData.length - 1 ? "" : <hr />}
                    </React.Fragment>
                )
            }) : <h2 style={{ marginTop: "1%" }}>Article Loading ...</h2>}
            <Pagination size="lg" style={{ marginBottom: "5rem", marginLeft: "10%", }}>
                <Pagination.Prev disabled={page == 1} onClick={handlePrev} />
                <Pagination.Next onClick={handleNext} />
            </Pagination>
        </Container>
    </>
}

export default CrowdbopRankings;
