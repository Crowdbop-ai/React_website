import React, { useState } from 'react';
import { Card, Container, Row, Col, Pagination } from 'react-bootstrap';

const CrowdbopRecommended = () => {
  // Placeholder data
  const allItems = [
    {
      id: 1,
      designer: 'Balenciaga',
      price: '$495',
      description: 'Oversized logo hoodie'
    },
    {
      id: 2,
      designer: 'Prada',
      price: '$1,200',
      description: 'Re-nylon shoulder bag'
    },
    {
      id: 3,
      designer: 'Gucci',
      price: '$780',
      description: 'GG canvas sneakers'
    },
    {
      id: 4,
      designer: 'Saint Laurent',
      price: '$2,350',
      description: 'Loulou leather bag'
    },
    {
      id: 5,
      designer: 'Off-White',
      price: '$650',
      description: 'Arrow logo t-shirt'
    },
    {
      id: 6,
      designer: 'Dior',
      price: '$3,200',
      description: 'Saddle bag'
    },
    {
      id: 7,
      designer: 'Louis Vuitton',
      price: '$1,850',
      description: 'Monogram backpack'
    },
    {
      id: 8,
      designer: 'Burberry',
      price: '$950',
      description: 'Checkered trench coat'
    },
    {
      id: 9,
      designer: 'Fendi',
      price: '$1,100',
      description: 'Peekaboo handbag'
    },
    {
      id: 10,
      designer: 'Versace',
      price: '$1,450',
      description: 'Medusa head belt'
    },
    {
      id: 11,
      designer: 'Valentino',
      price: '$2,800',
      description: 'Rockstud pumps'
    },
    {
      id: 12,
      designer: 'Givenchy',
      price: '$1,650',
      description: 'Antigona tote'
    }
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(allItems.length / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allItems.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="my-5">
      <h2 className="mb-4" style={{ fontFamily: "'Archivo Black', sans-serif" }}>
        Items You Might Like...
      </h2>
      
      <Row xs={1} sm={2} md={3} className="g-4 mb-4">
        {currentItems.map((item) => (
          <Col key={item.id}>
            <Card className="h-100">
              <div 
                className="bg-light" 
                style={{ 
                  height: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span className="text-muted">Product Image</span>
              </div>
              <Card.Body>
                <Card.Title style={{ fontFamily: "'Archivo Black', sans-serif" }}>
                  {item.description}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {item.price}
                </Card.Subtitle>
                <Card.Text>
                  {item.designer}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <div className="d-flex justify-content-center">
        <Pagination>
          <Pagination.Prev 
            onClick={() => paginate(Math.max(1, currentPage - 1))} 
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next 
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))} 
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </Container>
  );
};

export default CrowdbopRecommended;