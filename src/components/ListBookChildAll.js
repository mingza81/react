import React, { useState, useEffect } from 'react';
import './ListBook.css';
import Axios from 'axios';
import NavMenu from './NavMenu';
import NavCategory from './NavCategory';
import '../pages/LoginPage.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';

function ListBook() {
  const [bookList, setBookList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const getBookList = () => {
    Axios.get('http://localhost:3001/Child').then((response) => {
      setBookList(response.data);
    });
  };

  useEffect(() => {
    getBookList();
  }, []);

  // Filter bookList based on searchQuery
  const filteredBooks = bookList.filter((book) =>
    book.book_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <NavMenu />
      <NavCategory />
      <div className='container'>
        <div className='topicBook'>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control 
              type="text" 
              placeholder="ค้นหาหนังสือ...."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form.Group>
          <p className='font1'>หนังสือเด็กทั้งหมด</p>
          <div className="card-container">
            {filteredBooks.map((data, index) => (
              <Card key={index} style={{ width: '100%', height: '500px' }} className="custom-card">
                {/* In case the path is a URL that can be accessed */}
                <Card.Img variant="top" style={{ height: '300px' }} src={data.cover_pdf} />
                <Card.Body>
                  <Card.Title>{data.book_title}</Card.Title>
                  <Card.Text>ผู้แต่ง: {data.author}</Card.Text>
                  <Button variant="success" className='btnBook' onClick={() => window.location.href=`/bookdetail/${data.bookid}`}>
                    ดูรายละเอียด
                    </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ListBook;