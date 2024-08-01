import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

function ExaminePage() {
  const [bookList, setBookList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  }
  const getBookList = () => {
    Axios.get('http://localhost:3001/historymoney', {
      params: {
        category: selectedCategory
      }
    }).then((response) => {
      setBookList(response.data);
    }).catch(error => {
      console.error("There was an error fetching the data!", error);
    });
  };

  useEffect(() => {
    getBookList();
  }, [selectedCategory]);

  // Filter bookList based on searchQuery
  const filteredBooks = bookList.filter((book) =>
    book.book_title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalRentalSales = filteredBooks.reduce((total, book) => total + book.rental_price, 0);

  return (
    
    <Container>
      <div className='topicBook'>
      <Navbar style={{ backgroundColor: '#bdbdbd' }} data-bs-theme="dark">
        <Container>
          <Navbar.Brand >Admin Horsamud</Navbar.Brand>
          <Button variant="secondary" style={{ marginRight: '20px' }} onClick={handleLogout}>ออกจากระบบ</Button>
        </Container>
      </Navbar>
        <p className='font1' style={{ marginTop: '15px' }}>ยอดขาย</p>
        <Container>
          <Row>
            <Form.Label>หมวดหมู่</Form.Label>
            <Form.Select 
            style={{ marginBottom: '15px' }}
              aria-label="Default select example" 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">รายการทั้งหมด</option>
              <option value="การเงินการลงทุน">การเงินการลงทุน</option>
              <option value="จิตวิทยา">จิตวิทยา</option>
              <option value="นิยาย">นิยาย</option>
              <option value="หนังสือเด็ก">หนังสือเด็ก</option>
              <option value="การศึกษา">การศึกษา</option>
            </Form.Select>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control 
                type="text" 
                placeholder="ค้นหาหนังสือ...."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form.Group>
          </Row>
          <Row>
          <Row>
            <Col xs lg="1"><p style={{ fontSize: '18px' }}>ลำดับ</p></Col>
            <Col xs lg="7"><p style={{ fontSize: '18px' }}>ชื่อหนังสือ</p></Col>
            <Col xs lg="3"><p style={{ fontSize: '18px' }}>หมวดหมู่</p></Col>
            <Col xs lg="1"><p style={{ fontSize: '18px' }}>ราคา</p></Col>
          </Row>
          {filteredBooks.map((book, index) => (
            <Row key={book.id} className="bookItem">
              <Col xs lg="1">
                {index + 1}
              </Col>
              <Col xs lg="7">{book.book_title}</Col>
              <Col xs lg="3">{book.category}</Col>
              <Col xs lg="1">{book.rental_price}</Col>
            </Row>
            
          ))}
          </Row>
          <Row style={{ marginTop: '15px' }}>
             <Col xs="auto" style={{ paddingRight: '5px' }}>
                 <p style={{ fontSize: '25px' }}>ยอดขายรวม :</p>
             </Col>
             <Col xs="auto" style={{ paddingLeft: '5px' }}>
                 <p style={{ fontSize: '25px' }}>{totalRentalSales} บาท</p>
             </Col>
           </Row>
        </Container>
      </div>
    </Container>
  );
}

export default ExaminePage;
