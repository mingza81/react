import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavMenu from './NavMenu';
import './ListBook.css';
import PdfViewer from './PdfViewer';
import './Book.css';
import { useNavigate } from 'react-router-dom';

function StoryBook() {
    const [book, setBook] = useState(null);
    let { bookid } = useParams();
    const [copiedText, setCopiedText] = useState('');
    const navigate = useNavigate(); 

    useEffect(() => {
        const handleKeyUp = (e) => {
          navigator.clipboard.writeText('');
          setCopiedText('');
          navigate('/mybook');
        };
    
        document.addEventListener('keyup', handleKeyUp);
    
        return () => {
          document.removeEventListener('keyup', handleKeyUp);
        };
      }, []); 
    const fetchBookDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/mybooks/${bookid}`);
            setBook(response.data[0]); // Since the result is likely an array with a single book object
        } catch (error) {
            console.error("Error fetching book details:", error);
        }
    };
    
    useEffect(() => {
        fetchBookDetails();
    }, [bookid]);
   
    return (
        <div>
            {book ? (
                <>
                    <NavMenu />
                    <div style={{ marginTop: '20px' }}>
                    <PdfViewer file={book.story_pdf} />
                    </div>
                </>
            ) : (
                    <>
                        <NavMenu />
                        <h1>Page 404 ไม่พบรายการ</h1>
                    </>
                )}
        </div>
    );
}

export default StoryBook;