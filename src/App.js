import './App.css';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SellBooksPage from './pages/SellBooksPage';
import MyBookPage from './pages/MyBookPage';
import BucketPage from './pages/BucketPage';
import RegisterPage from './pages/RegisterPage';
import ListBookChildAll from '../src/components/ListBookChildAll';
import ListBookEducationalAll from '../src/components/ListBookEducationalAll';
import ListBookFinanceAll from '../src/components/ListBookFinanceAll';
import ListBookNovelAll from '../src/components/ListBookNovelAll';
import ListBookPsychologyAll from '../src/components/ListBookPsychologyAll';
import AllBookList from '../src/components/AllBookList';
import EBookDetail from '../src/components/EBookDetail';
import Payment from './components/Payment';
import { useRoutes } from 'react-router-dom';



const routes = [
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '/bookshop',
    element: <SellBooksPage />,
  },
  {
    path: '/bookshop/child',
    element: <ListBookChildAll />,
  },
  {
    path: '/bookshop/educational',
    element: <ListBookEducationalAll />,
  },
  {
    path: '/bookshop/finance',
    element: <ListBookFinanceAll />,
  },
  {
    path: '/bookshop/novel',
    element: <ListBookNovelAll />,
  },
  {
    path: '/bookshop/psychology',
    element: <ListBookPsychologyAll />,
  },
  {
    path: '/mybook',
    element: <MyBookPage />,
  },
  {
    path: '/bucket',
    element: <BucketPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/bookshop/allbook',
    element: <AllBookList />,
  },
  {
    path: '/bookdetail/:bookid',
    element: <EBookDetail />,
  },
  {
    path: '/bucket/payment',
    element: <Payment />,
  },

];

function App() {
  const routeResult = useRoutes(routes);
  
  return routeResult 
}

export default App;
