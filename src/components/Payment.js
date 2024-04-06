import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';

function Payment() { // Capitalize the function name
    const navigate = useNavigate(); 
    const [bucketItems, setBucketItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const userid = JSON.parse(localStorage.getItem('users')); 
    const handleBucketsButtonClick = () => {
        navigate('/bucket');

       
    };
    const getBucketList = useCallback(() => {
        Axios.get('http://localhost:3001/bucketusers', {
            params: {
                userid: userid.userid // Send userid to the API
            }
        }).then((response) => {
            setBucketItems(response.data);
            calculateTotalPrice(response.data);
        }).catch((error) => {
            console.error('Error fetching bucket items:', error);
        });
    }, [userid, setBucketItems]); // Dependency array specifying that getBucketList depends on userid and setBucketItems

    const calculateTotalPrice = (items) => {
        let total = 0;
        items.forEach(item => {
            total += item.rental_price;
        });
        setTotalPrice(total);
    };

    useEffect(() => {
        if (userid) {
            getBucketList();
        }
    }, [userid, getBucketList]);

    return (
        <>
            <div className='container'>
                <div className='topicBook'>
                    <p className='font1'>ชำระเงิน</p>
                    <Container className='con1'>
                        <Row>
                            {bucketItems.map((item, index) => (
                                <Row key={index}>
                                    <Col xs lg="2">
                                        {index + 1}
                                    </Col>
                                    <Col>{item.book_title}</Col>
                                    <Col md="auto">7 วัน</Col>
                                    <Col xs lg="2">{item.rental_price} บาท</Col>
                                    <Col xs lg="2">
                                        
                                    </Col>
                                </Row>
                            ))}
                        </Row>
                    </Container>
                </div>
                <div>
                 <h3>ยอดชำระ : {totalPrice} บาท</h3>
                 <div>
            <Button variant="success" onClick={handleBucketsButtonClick}>
                กลับไปยังตระกร้า
            </Button>
        </div>
                </div>
            </div>
        </>
        
    );
}

export default Payment;