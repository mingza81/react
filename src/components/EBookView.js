import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavMenu from './NavMenu';
import './ListBook.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

const EbookView = ({ onAddToBucket }) => {
    const [book, setBook] = useState(null);
    const [isPurchased, setIsPurchased] = useState(false);
    let { bookid } = useParams();

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/book/${bookid}`);
                setBook(response.data);
            } catch (error) {
                console.error("Error fetching book details:", error);
            }
        };

        fetchBookDetails();
        checkIfPurchased();
    }, [bookid]);

    const getUserId = () => {
        const userData = JSON.parse(localStorage.getItem('users'));
        if (userData && userData.userid) {
            return userData.userid;
        } else {
            console.error('User data not found or User ID missing');
            return null;
        }
    };

    const checkIfPurchased = async () => {
        const userid = getUserId();
        if (!userid) return;

        try {
            const response = await axios.get(`http://localhost:3001/userbook?userid=${userid}&bookid=${bookid}`);
            if (response.data.length > 0) {
                setIsPurchased(true);
            }
        } catch (error) {
            console.error('Error checking purchase status:', error);
        }
    };

    const handleAddToBucket = async (bookid) => {
        const userid = getUserId();
        if (!userid) return;

        try {
            const response = await axios.get(`http://localhost:3001/bucketuser?userid=${userid}&bookid=${bookid}`);
            if (response.data.length > 0) {
                alert('This book is already in your bucket.');
            } else {
                const data = { userid, bookid };
                await axios.post('http://localhost:3001/bucket', data);
                alert('หนังสือถูกเพิ่มในตระกร้าเรียบร้อย !!!');
            }
        } catch (error) {
            console.error('Error adding item:', error);
            alert('หนังสือได้ถูกเพื่มในตระกร้าแล้ว !!!');
        }
    };

    return (
        <div>
            {book ? (
                <>
                    <NavMenu />
                    <Container>
                        <Row>
                            <h2 className="title1" style={{ marginBottom: '50px', marginTop: '30px' }}>{book.book_title}</h2>
                            <Col>
                                <Card.Img variant="top" style={{ width: '380px', height: '540px', marginLeft: '25%' }} src={book.cover_pdf} />
                            </Col>

                            <Col style={{ marginBottom: '20px', marginTop: '100px' }}>
                                <p style={{ fontSize: '18px' }}>หมวดหมู่: {book.category}</p>
                                <p style={{ fontSize: '18px' }}>ชื่อผู้แต่ง: {book.author}</p>
                                <p style={{ fontSize: '18px' }}>รายการเช่า 7 วัน ราคา: {book.rental_price} บาท</p>
                                {isPurchased ? (
                                    <p style={{ color: 'red', fontSize: '18px' }}>คุณได้ซื้อหนังสือเล่มนี้ไปแล้ว</p>
                                ) : (
                                    <Button style={{ marginBottom: '30px' }} variant="secondary" onClick={() => handleAddToBucket(book.bookid)}>
                                        เพิ่มลงตระกร้า!!
                                    </Button>
                                )}
                                <h4 style={{ marginBottom: '20px' }}>เนื่อเรื่องโดยย่อ</h4>
                                <p style={{ fontSize: '18px' }}>{book.content_pdf}</p>
                            </Col>
                        </Row>
                    </Container>
                </>
            ) : (
                <>
                    <NavMenu />
                    <h1>Page 404 ไม่พบรายการ</h1>
                </>
            )}
        </div>
    );
}

export default EbookView;
