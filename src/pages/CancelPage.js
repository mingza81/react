import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

function CancelPage() {
    return (
        <>
        
        <div className='container'>
        <Alert variant="danger" style={{ marginTop: '30px' }}>
      <Alert.Heading>ชำระเงินล้มเหลว !!!!</Alert.Heading>
      <p>
        หากต้องการชำระเงินกรุณาทำรายการใหม่
      </p>
      <hr />
      <p className="mb-0">
      <Button variant="danger" onClick={() => window.location.href=`/bucket`}>ทำรายการใหม่</Button>
      </p>
    </Alert>
            </div>
        </>
    );
  }

  export default CancelPage;