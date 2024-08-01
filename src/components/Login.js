import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('users', JSON.stringify({
          email: email,
          password: password,
          userid: data.userid,
          firstname: data.firstname,
          lastname: data.lastname
        }));
        console.log('Login successful');
        alert("ล้อคอินสำเร็จ");
        if (email === 'admin@gmail.com') {
          navigate('/examine');
        } else {
          navigate('/home');
        }
      } else {
        console.error('Login failed: ', data.message);
        alert('ไม่พบบัญชีผู้ใช้ ');
      }
    } catch (error) {
      console.error('Error during login: ', error);
    }
  };
  const handleRegisterButtonClick = () => {
    // เมื่อปุ่ม Register ถูกคลิก
    navigate('/register');
  };

  return (
    
    <Container className='LoginBody'>
      <div className='Login'>
        <h2>Horsamud</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Login
          </Button>
          <Button className='btnReg'  variant="primary" type="button" onClick={handleRegisterButtonClick}>
            Register
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default Login;