import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './NavMenu.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
function NavMenu(){

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  }
  const users = JSON.parse(localStorage.getItem('users'))

    return(
      <div>
      <Navbar style={{ backgroundColor: '#235D3A' }} data-bs-theme="dark">
        <Container>
          <Navbar.Brand >Horsamud</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/home">หน้าแรก</Nav.Link>
            <Nav.Link href="/bookshop">ร้านหนังสือ</Nav.Link>
            <Nav.Link href="/mybook">หนังสือของฉัน</Nav.Link>
            <Nav.Link href="/bucket">ตระกร้า</Nav.Link>
          </Nav>
          <div className="ms-auto">
          <div>
        
          <DropdownButton
           id="dropdown-button-dark-example2"
           variant="success"
           title={`ยินดีต้อนรับ ผู้ใช้ : ${users.firstname}`}
           data-bs-theme="dark"
          >
        <Dropdown.Item href="/history">ประวัติการเช่าหนังสือ</Dropdown.Item>
        
        <Dropdown.Divider />
        <Dropdown.Item onClick={handleLogout}>ออกจากระบบ</Dropdown.Item>
      </DropdownButton>
      </div>
        </div>
        </Container>
      </Navbar>
    </div>
    
    )
}

export default NavMenu;