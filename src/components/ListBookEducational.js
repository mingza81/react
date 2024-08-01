import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './ListBook.css';
import Axios from 'axios';

function ListBook() {
  const [bookList, setBookList] = useState([]);

  const getBookList = () => {
    Axios.get('http://localhost:3001/Educational').then((response) => {
      setBookList(response.data);
    });
  };

  useEffect(() => {
    getBookList();
  }, []);

  return (
    <div className="card-container">
      {bookList.slice(0, 5).map((data, index) => (
        <Card key={index} style={{ width: '100%', height: '500px' }} className="custom-card">
          {/* ในกรณีที่ path เป็น URL ที่สามารถเข้าถึงได้ */}
          <Card.Img variant="top" style={{ height: '300px' }}src={data.cover_pdf} />
  
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
  );
}

export default ListBook;