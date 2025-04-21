import React, { useState, useEffect } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Pagination,
  Spinner,
  Alert,
} from "react-bootstrap";

const CrowdbopRecommended = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(sessionStorage.getItem("userId") || "");

  const itemsPerPage = 6;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://s5g4aq9wn1.execute-api.us-east-2.amazonaws.com/prod/fallback-recommendations"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.fallbackProducts || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (!userId) {
    return (
      <Container className="text-center" style={{ marginTop: "5rem" }}>
        <h2>You are not logged in.</h2>
        <p>Please log in to view your recommended items.</p>
      </Container>
    );
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container>
      <h1
        className="text-center mb-4"
        style={{ fontFamily: "'Archivo Black', sans-serif" }}
      >
        ITEMS YOU MIGHT LIKE...
      </h1>

      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status" />
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : (
        <>
          <Row xs={1} sm={2} md={3} className="g-4 mb-4">
            {currentItems.map((product) => (
              <Col key={product.ProductSIN}>
                <Card className="h-100">
                  <a
                    href={`https://www.shopbop.com${product.ProductDetailURL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Card.Img
                      variant="top"
                      src={`https://m.media-amazon.com/images/G/01/Shopbop/p/${product.PrimaryImageURL}`}
                      style={{
                        height: "300px",
                        width: "100%",
                        objectFit: "contain",
                        objectPosition: "top",
                        backgroundColor: "#ffac84",
                      }}
                    />
                  </a>
                  <Card.Body>
                    <Card.Title
                      style={{ fontFamily: "'Archivo Black', sans-serif" }}
                    >
                      {product.ProductName}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      ${product.Price.toFixed(2)}
                    </Card.Subtitle>
                    <Card.Text>{product.DesignerName}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="d-flex justify-content-center">
            <Pagination>
              <Pagination.Prev
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              />
              {/* {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))} */}
              <Pagination.Next
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </>
      )}
    </Container>
  );
};

export default CrowdbopRecommended;
