import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';



function SellBookPage() {

  return (
    <>
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
       
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link href="/bookshop/allbook">หนังสือทั้งหมด</Nav.Link>
            <Nav.Link href="/bookshop/novel">หนังสือนิยาย</Nav.Link>
            <Nav.Link href="/bookshop/finance">หนังสือการเงิน</Nav.Link>
            <Nav.Link href="/bookshop/psychology">หนังสือจิตวิทยา</Nav.Link>
            <Nav.Link href="/bookshop/educational">หนังสือการศึกษา</Nav.Link>
            <Nav.Link href="/bookshop/child">หนังสือเด็ก</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  );
}

export default SellBookPage;
