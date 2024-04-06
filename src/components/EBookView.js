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
    let { bookid } = useParams();

    useEffect(() => {
        // Function to fetch book details using bookid
        const fetchBookDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/book/${bookid}`);
                setBook(response.data);
            } catch (error) {
                console.error("Error fetching book details:", error);
            }
        };

        // Call the function to fetch book details
        fetchBookDetails();
    }, [bookid]);
    function getUserId() {
      // ตรวจสอบว่ามีข้อมูลผู้ใช้ที่เก็บใน localStorage หรือไม่
      const userData = JSON.parse(localStorage.getItem('users'));
      if (userData && userData.userid) {
        return userData.userid; // ส่งค่า User ID กลับ
      } else {
        // หากไม่พบข้อมูลผู้ใช้หรือไม่มี User ID ใน localStorage
        // คุณสามารถดำเนินการตามที่คุณต้องการ เช่น โปรแกรมให้ผู้ใช้ลงชื่อเข้าใช้ก่อนหรือแสดงข้อความแจ้งเตือน
        console.error('User data not found or User ID missing');
        return null;
      }
    }

    const handleAddToBucket = (bookid) => {
      const userid = getUserId(); // Assuming you have a function to get user ID
  
      // Check if the bookid already exists in the user's bucket
      axios.get(`http://localhost:3001/bucketuser?userid=${userid}&bookid=${bookid}`)
          .then((response) => {
              const { data } = response;
              if (data.length > 0) {
                  alert('This book is already in your bucket.');
                  return; // Stop execution if the book is already in the bucket
              } else {
                  // If the bookid does not exist in the user's bucket, add it
                  const data = {
                      userid: userid,
                      bookid: bookid
                  };
                  axios.post('http://localhost:3001/bucket', data)
                      .then((result) => {
                          alert(result.data.message);
                      })
                      .catch((error) => {
                          console.error('Error adding item:', error);
                          alert('Failed to add item. Please try again later.');
                      });
              }
          })
          .catch((error) => {
              console.error('Error checking bucket:', error);
              alert('Failed to check bucket. Please try again later.');
          });
  };

    return (
        <div>
            {book ? (
                <>
                    <NavMenu />
                    <Container className='ctn1'>
                        <Row>
                            <h2 className="title1">{book.book_title}</h2>
                            <Col>
                                <Card.Img variant="top" style={{ width: '380px', height: '540px' }} src={book.cover_pdf} />
                            </Col>

                            <Col>
                                <p >หมวดหมู่: {book.category}</p>
                                <p>ชื่อผู้แต่ง: {book.author}</p>
                                <p>รายการเช่า 7 วัน ราคา: {book.rental_price} บาท</p>
                                <Button  variant="secondary" onClick={() => handleAddToBucket(book.bookid)}>
                                    เพิ่มลงตระกร้า!!
                                </Button>
                                <p className="title1">เนื่อเรื่องโดยย่อ</p>
                                <p>{book.content_pdf}</p>
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