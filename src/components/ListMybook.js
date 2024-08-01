import React, { useState, useEffect } from 'react';
import './ListBook.css';
import Axios from 'axios';
import '../pages/LoginPage.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';


function ListBook() {
  const [bookList, setBookList] = useState([]);
  

  const getBookList = () => {
    const userData = JSON.parse(localStorage.getItem('users'));
    const userid = userData.userid;
    Axios.get(`http://localhost:3001/mybook/${userid}`).then((response) => {
      setBookList(response.data);
    });
  };

  useEffect(() => {
    getBookList();
  }, []);

  return (
    <>
      
          <div className="card-container">
            {bookList.map((data, index) => (
              <Card key={index} style={{ width: '100%', height: '500px' }} className="custom-card">
                {/* In case the path is a URL that can be accessed */}
                <Card.Img variant="top" style={{ height: '300px' }} src={data.cover_pdf} />
                <Card.Body>
                  <Card.Title>{data.book_title}</Card.Title>
                  <Card.Text>หมวดหมู่: {data.category}</Card.Text>
                  <Card.Text>ระยะเวลา 7 วัน เริ่ม: {new Date(data.datebook).toLocaleDateString()}</Card.Text>
                  <Button variant="success" className='btnBook' onClick={() => window.location.href=`/storybook/${data.bookid}`}>
                    อ่านหนังสือ
                    </Button>
                </Card.Body>
              </Card>
            ))}
         
      </div>
    </>
  );
}

export default ListBook;