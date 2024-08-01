import React, { useState } from 'react';
import './ListBook.css';
import NavMenu from './NavMenu';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';


function InfoBookSell() {
  const userid = JSON.parse(localStorage.getItem('users'));
  const [book_title, setBook_title] = useState("");
  const [file, setFile] = useState();
  const [content_pdf, setContent_pdf] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [rental_price, setRental_price] = useState();
  const [status, setStatus] = useState("กำลังตรวจสอบ");
  const [msg, setMsg] = useState("");
     

  
  const upload = () => {
      const formData = new FormData()
      formData.append("email", userid.email);
      formData.append("book_title", book_title);
      formData.append('file', file)
      formData.append("content_pdf", content_pdf);
      formData.append("category", category)
      formData.append("author", author);
      formData.append("rental_price", rental_price);
      formData.append("status", status);
      axios.post('http://localhost:3001/bookselling',formData )
      .then((response) => {
          console.log(response);
          if(response.data.Status === 'Success') {
              setMsg("File Successfully Uploaded");
              alert("ลงรายการสำเร็จกำลังดำเนินการตรวจสอบ")
          }else{
              setMsg("Error");
          }
      })
      .catch(er => console.log(er))
  }

  return (
    <>
      <NavMenu />
      <div className="container">
        <div className="topicBook">
          <p className="font1">ลงขายหนังสือ</p>
          <Form onClick={upload}>
          <Form.Group className="mb-3" controlId="book_title">
              <Form.Label>อีเมล</Form.Label>
              <Form.Control type="text" name="book_title" value={userid.email} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="book_title">
              <Form.Label>ชื่อหนังสือ</Form.Label>
              <Form.Control type="text" name="book_title" onChange={(e) => setBook_title(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="author">
              <Form.Label>ชื่อผู้เขียน/นามปากกา</Form.Label>
              <Form.Control type="text" name="author" onChange={(e) => setAuthor(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="category">
              <Form.Label>หมวดหมู่</Form.Label>
              <Form.Select aria-label="Default select example"onChange={(e) => setCategory(e.target.value)}>
                <option value="การเงินการลงทุน">การเงินการลงทุน</option>
                <option value="จิตวิทยา">จิตวิทยา</option>
                <option value="นิยาย">นิยาย</option>
                <option value="หนังสือเด็ก">หนังสือเด็ก</option>
                <option value="การศึกษา">การศึกษา</option>
            </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="rental_price">
              <Form.Label>ราคา *ต่อการเช่า 7 วัน</Form.Label>
              <Form.Control type="number" name="rental_price" onChange={(e) => setRental_price(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>เนื้อเรื่องโดยย่อ</Form.Label>
              <Form.Control as="textarea" rows={5} name="content_pdf" onChange={(e) => setContent_pdf(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>อัปโหลดไฟล์ * หน้าปก/เนื่อหาไฟล์ PDF และรวมเป็นไฟล์ ZIP</Form.Label>
              <br />
              <input type="file"  onChange={(e) => setFile(e.target.files[0])} />
            </Form.Group>
            <Button variant="secondary" type="submit">
              บันทึกรายการ!!
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}

export default InfoBookSell;
