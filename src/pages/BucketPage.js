import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import NavMenu from '../components/NavMenu';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';

function BucketPage() {
    const [bucketItems, setBucketItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const userid = JSON.parse(localStorage.getItem('users')); 

    const navigate = useNavigate(); 
    const handlePaymentButtonClick = () => {
        // เมื่อปุ่ม Register ถูกคลิก
        navigate('/bucket/payment');
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
                                        <Button variant="danger" onClick={() => removeFromBucket(item.bookid)}>
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
                 <Button variant="success" onClick={handlePaymentButtonClick}>
                        ไปที่หน้าชำระเงิน
                 </Button>
                </div>
            </div>
        </>
    );
}

export default BucketPage;
