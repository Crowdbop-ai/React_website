import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal, Form} from "react-bootstrap";
import { AlignCenter, TextCenter, Trash } from "react-bootstrap-icons";

const imgBaseURL = "https://m.media-amazon.com/images/G/01/Shopbop/p";
const itemBaseURL = "https://www.shopbop.com/";

function CrowdbopLikedItems() {
    const [likedItems, setLikedItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Retrieve userId from sessionStorage (assumes user is logged in)
    const [showModal, setShowModal] = useState(false);
    const [userId, setUserId] = useState(sessionStorage.getItem("userId") || ""); // Get userId 

    // Fetch liked items from the backend dynamically
    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        fetch(`https://s5g4aq9wn1.execute-api.us-east-2.amazonaws.com/prod/liked-items?userId=${userId}`)
            .then(res => res.json())
            .then(data => {
                console.log("API Response:", data);
                setLikedItems(data.likedItems || []); // Store fetched liked items
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error fetching liked items:", error);
                setIsLoading(false);
            });
    }, [userId]);

    // Function to delete an item via the AWS API Gateway
    const handleDelete = (productSIN, categoryId) => {
        fetch("https://s5g4aq9wn1.execute-api.us-east-2.amazonaws.com/prod/remove-like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId,
                productSIN: productSIN,
                categoryId: categoryId
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Failed to delete item.");
            }
            // On success, remove the item from state
            setLikedItems(prevItems => prevItems.filter(item => item.ProductSIN !== productSIN));
        })
        .catch(error => {
            console.error("Error deleting item:", error);
            alert("Failed to delete item. Please try again.");
        });
    };

    // If user is not logged in, show a message with a disabled login button
    // console.log(userId);
    // if (!userId) {
    //     return (
    //         <Container className="text-center" style={{ marginTop: "5rem" }}>
    //             <h2>You are not logged in.</h2>
    //             <p>Please log in to view your liked items.</p>
    //             <Button variant="primary" onClick={() => setShowModal(true)}>
    //                 Log In
    //             </Button> {/* Disabled button */}

    //             {/* Login Modal */}
    //             <Modal
    //                 show={showModal}
    //                 onHide={() => setShowModal(false)}
    //                 centered
    //                 backdrop="static"
    //                 keyboard={false}
    //             >
    //                 <Modal.Header closeButton={false}>
    //                     <Modal.Title style={{ fontFamily: "'Archivo Black', sans-serif" }}>
    //                         Enter Your User ID
    //                     </Modal.Title>
    //                 </Modal.Header>
    //                 <Modal.Body>
    //                     <Form>
    //                         <Form.Group controlId="userIdInput">
    //                             <Form.Label>User ID</Form.Label>
    //                             <Form.Control
    //                                 type="text"
    //                                 placeholder="Ex: bbadger"
    //                                 value={userId}
    //                                 onChange={(e) => setUserId(e.target.value)}
    //                                 style={{ fontFamily: "Arial, sans-serif" }}
    //                             />
    //                             <Form.Text className="text-muted">
    //                                 This ID will be used to track your votes and liked items.
    //                             </Form.Text>
    //                         </Form.Group>
    //                     </Form>
    //                 </Modal.Body>
    //                 <Modal.Footer>
    //                     <Button
    //                         variant="primary"
    //                         onClick={handleSubmit}
    //                         style={{
    //                             backgroundColor: "#E85C41",
    //                             border: "none",
    //                             fontFamily: "'Archivo Black', sans-serif",
    //                         }}
    //                     >
    //                         Submit
    //                     </Button>
    //                 </Modal.Footer>
    //             </Modal>
    //         </Container>
    //     );
    // }

    // Show loading message while fetching data
    if (isLoading) {
        return <h2 className="text-center" style={{ marginTop: "2rem" }}>Loading your liked items...</h2>;
    }

    return (
        <Container fluid style={{ marginTop: "2rem", maxWidth: "800px" }}>
            <h1 className="text-center mb-4">Your Liked Items</h1>
            
            {/* display userID */}
            <div className="text-center mt-3">
                <p><b>User ID: {userId}</b></p>
            </div>

            {/* If no liked items exist, show message */}
            {likedItems.map((item, index) => {
                /*console.log("Rendering item with SIN:", item.ProductSIN, "Category:", item.CategoryID);*/
                return (
                    <React.Fragment key={index}>
                        <Row className="align-items-center" style={{ marginBottom: "1.5rem" }}>
                            {/* Product Image & Link */}
                            <Col xs={4}>
                                <a href={itemBaseURL + item.ProductDetailURL} className="d-flex align-items-center">
                                    <img 
                                        src={imgBaseURL + item.PrimaryImageURL} 
                                        alt={item.ProductName} 
                                        style={{ width: "150px", borderRadius: "5px" }} 
                                    />
                                </a>
                            </Col>

                            {/* Product Details */}
                            <Col xs={6}>
                                <p style={{ margin: "0", fontSize: "18px" }}>
                                    <strong>{item.ProductName}</strong> by {item.DesignerName} <br />
                                    Price: <strong>${item.Price}</strong>
                                </p>
                            </Col>

                            {/* Delete Button */}
                            <Col xs={2} className="text-center">
                                <Button variant="danger" onClick={() => handleDelete(item.ProductSIN, item.CategoryID)}>
                                    <Trash size={24} />
                                </Button>
                            </Col>
                        </Row>
                        {/* Add horizontal line between items */}
                        {index !== likedItems.length - 1 && <hr />}
                    </React.Fragment>
                );
            })}
        </Container>
    );
}

export default CrowdbopLikedItems;
