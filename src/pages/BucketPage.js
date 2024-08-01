import React, { useState, useEffect, useCallback } from 'react';
import NavMenu from '../components/NavMenu';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import {loadStripe} from '@stripe/stripe-js';

import axios from 'axios';

function BucketPage() {
    const [bucketItems, setBucketItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const userid = JSON.parse(localStorage.getItem('users'));
    
    const placeorder = async (data) => {
        
        const bodyData = {
            "user": {
                "name" : 'mic'
            },
            "product": {
                "name": "book",
                "price": totalPrice ,
                "quantity" : 1 
            }
        }
        const response = await axios.post('http://localhost:3001/api/checkout', bodyData);
        const sessionId = response.data.sessionid
        const stripe = await loadStripe("pk_test_51P57HzRwtyPChAqi7aPoePBaJQurQNskcOOYuzF5iLGrsNVe3t4c066kmg1in44bJS7sJBMJOrZ1IUtKHvT211qh00yMKgJtev");
       
        stripe.redirectToCheckout({sessionId})

    }

    const submitCheckout = async () => {
        if (totalPrice === 0) {
            alert("ไม่มีรายการชำระ");
        } else {
            await placeorder({ totalPrice: totalPrice });
        }
    };

    const removeFromBucket = (bookid) => {
        const userData = JSON.parse(localStorage.getItem('users'));
        const userid = userData.userid;
        Axios.delete(`http://localhost:3001/delete/${userid}/${bookid}`).then((response) => {
            console.log('Deletion response:', response);
            getBucketList(); 
        }).catch((error) => {
            console.error('Error removing item from bucket:', error);
        });
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
    }, [userid, getBucketList]); // Re-run useEffect when userid changes

    return (
        <>
            <NavMenu />
            <div className='container'>
                <div className='topicBook'>
                    <p className='font1'>ตระกร้าหนังสือ</p>
                    <Container>
                        <Row>
                        <Row>
                <Col xs lg="2">
                    <p style={{ fontSize: '18px' }}>ลำดับ</p>
                </Col>
                <Col>
                    <p style={{ fontSize: '18px' }}>ชื่อหนังสือ</p>
                </Col>
                <Col xs lg="1">
                    <p style={{ fontSize: '18px' }}>ระยะเวลา</p>
                </Col>
                <Col xs lg="1">
                    <p style={{ fontSize: '18px' }}>ราคา</p>
                </Col>
                <Col xs lg="2">
                    <p></p>
                </Col>
            </Row>
                            {bucketItems.map((item, index) => (
                                <Row key={index} style={{ marginBottom: '10px' }}>
                                    <Col xs lg="2">
                                        {index + 1}
                                    </Col>
                                    <Col>{item.book_title}</Col>
                                    <Col xs lg="1">7 วัน</Col>
                                    <Col xs lg="1">{item.rental_price} บาท</Col>
                                    <Col xs lg="2">
                                        <Button className="btn-sm"  variant="warning" onClick={() => removeFromBucket(item.bookid)}>
                                            ลบรายการ
                                        </Button>
                                    </Col>
                                </Row>
                            ))}
                        </Row>
                    </Container>
                </div>
                <div>
                 <h3>ยอดชำระ : {totalPrice} บาท</h3>
                 
                 <Button variant="success" onClick={() => submitCheckout()}>
                        ไปที่หน้าชำระเงิน
                 </Button>
                </div>
            </div>
        </>
    );
}

export default BucketPage;
