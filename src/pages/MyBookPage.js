import NavMenu from '../components/NavMenu';
import ListMybook from '../components/ListMybook';

function MyBookPage() {
    return (
        <>
        <NavMenu/>
        <div className='container'>
                <div className='topicBook'>
                    <p className='font1'>หนังสือของฉัน</p>
                    <ListMybook/>
                </div>
            </div>
        </>
    );
  }

  export default MyBookPage;