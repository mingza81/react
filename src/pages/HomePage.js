import NavMenu from '../components/NavMenu';
import ListBookNovel from '../components/ListBookNovel';
import ListBookFinance from '../components/ListBookFinance';
import ListBookPsychology from '../components/ListBookPsychology';
import ListBookEducational from '../components/ListBookEducational';
import ListBookChild from '../components/ListBookChild';
import './LoginPage.css'



function HomePage() {
    return (
        <>
       <NavMenu/>
       <div className='container'>
       <div className='topicBook'>
       <p className='font1'>หนังสือนิยายแนะนำ</p>
       </div>
        <ListBookNovel/>
        <div className='topicBook1'>
       <p className='font1'>หนังสือการเงินแนะนำ</p>
       </div>
        <ListBookFinance/>
        <div className='topicBook1'>
       <p className='font1'>หนังสือจิตวิทยาแนะนำ</p>
       </div>
        <ListBookPsychology/>
        <div className='topicBook1'>
       <p className='font1'>หนังสือการศึกษาแนะนำ</p>
       </div>
        <ListBookEducational/>
        <div className='topicBook1'>
       <p className='font1'>หนังสือเด็กแนะนำ</p>
       </div>
        <ListBookChild/>
       </div>
        </>
    );
  }

  export default HomePage;