import React, { useState, useEffect } from 'react';
import NavMenu from '../components/NavMenu';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Axios from 'axios';

function HistoryPage() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('users'));
        const userid = userData.userid;
        Axios.get(`http://localhost:3001/history/${userid}`)
            .then(response => {
                setBooks(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <>
            <NavMenu />
            <div className='container'>
                <div className='topicBook'>
                    <p className='font1'>ประวัติการซื้อ</p>
                    <Container>
                        <Row>
                            <Row>
                                <Col xs lg="2">
                                    <p style={{ fontSize: '18px' }}>ลำดับ</p>
                                </Col>
                                <Col>
                                    <p style={{ fontSize: '18px' }}>ชื่อหนังสือ</p>
                                </Col>
                                <Col xs lg="2">
                                    <p style={{ fontSize: '18px' }}>หมวดหมู่</p>
                                </Col>
                                <Col xs lg="2">
                                    <p style={{ fontSize: '18px' }}>ราคา</p>
                                </Col>
                                <Col xs lg="1">
                                    <p style={{ fontSize: '18px' }}>วันที่ซื้อ</p>
                                </Col>
                            </Row>
                            {books.map((book, index) => (
                                <Row key={index} style={{ marginBottom: '10px' }}>
                                    <Col xs lg="2">
                                        {index + 1}
                                    </Col>
                                    <Col>{book.book_title}</Col>
                                    <Col xs lg="2">{book.category}</Col>
                                    <Col xs lg="2">{book.rental_price}</Col>
                                    <Col xs lg="1">{new Date(book.buydate).toLocaleDateString()}</Col>
                                </Row>
                            ))}
                        </Row>
                    </Container>
                </div>
            </div>
        </>
    );
}

export default HistoryPage;