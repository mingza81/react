import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';


function SuccessPage() {
  const users = JSON.parse(localStorage.getItem('users'))
  const navigate = useNavigate(); 
  
  const removeFromBucket = () => {
    const userData = JSON.parse(localStorage.getItem('users'));
      const userid = userData.userid;
      Axios.delete(`http://localhost:3001/deletee/${userid}`).then((response) => {
          console.log('Deletion response:', response);
      }).catch((error) => {
          console.error('Error removing item from bucket:', error);
      });
      navigate('/home');
  };  

  return (
    <>
        
        <div className='container'>
          
        <Alert variant="success"  style={{ marginTop: '30px' }}>
      <Alert.Heading>ชำระเงินสำเร็จแล้ว !!!!</Alert.Heading>
      <p>
        ขอบคุณที่ใช้บริการ 
        <br/>
        Thanks for your order, {users.firstname} !
      </p>
      <hr />
      <p className="mb-0">
      <Button variant="success" onClick={() => removeFromBucket(users.userid)}>ไปยังรายการที่เช่า</Button>
      </p>
    </Alert>
            </div>
        </>
  );
}

export default SuccessPage;