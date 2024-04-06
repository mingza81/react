const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "bookshop"
})

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  
  db.query(
    'SELECT userid, firstname, lastname, email, password FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, result) => {
      if (err) {
        console.error('Error during login query: ', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      } else if (result.length > 0) {
        const { userid, firstname, lastname, email } = result[0]; // Extracting user data
        res.json({ success: true, message: 'Login successful', userid, firstname, lastname, email });
      } else {
        res.json({ success: false, message: 'Invalid credentials' });
      }
    }
  );
});

app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'ต้องกรอกข้อมูลทุกช่อง' });
  }

  try {

    const sql = 'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [firstName, lastName, email, password], (err, result) => {
      if (err) {
        console.error('Error inserting data: ' + err.message);
        res.status(500).json({ message: 'Internal Server Error' });
        return;
      }

      console.log('User registered and data inserted successfully');
      res.status(200).json({ message: 'Registration successful' });
    });
  } catch (error) {
    console.error('Server error: ' + error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/Novel' , (req, res) =>{
  db.query("SELECT * FROM books WHERE category = 'นิยาย'", (err, result) => {
    if (err){
      console.log(err);
    }else{
      res.send(result);
    }
  })
})
app.get('/Finance' , (req, res) =>{
  db.query("SELECT * FROM books WHERE category = 'การเงินการลงทุน'", (err, result) => {
    if (err){
      console.log(err);
    }else{
      res.send(result);
    }
  })
})
app.get('/Psychology' , (req, res) =>{
  db.query("SELECT * FROM books WHERE category = 'จิตวิทยา'", (err, result) => {
    if (err){
      console.log(err);
    }else{
      res.send(result);
    }
  })
})
app.get('/Educational' , (req, res) =>{
  db.query("SELECT * FROM books WHERE category = 'การศึกษา'", (err, result) => {
    if (err){
      console.log(err);
    }else{
      res.send(result);
    }
  })
})
app.get('/Child' , (req, res) =>{
  db.query("SELECT * FROM books WHERE category = 'หนังสือเด็ก'", (err, result) => {
    if (err){
      console.log(err);
    }else{
      res.send(result);
    }
  })
})
app.get('/book/:bookid' , (req, res) =>{
  const bookid = req.params.bookid;
  db.query("SELECT * FROM books WHERE bookid = ?", bookid, (err, result) => {
    if (err){
      console.log(err);
      res.status(500).send("Error fetching book details");
    } else {
      if (result.length === 0) {
        res.status(404).send("Book not found");
      } else {
        res.send(result[0]); // Assuming bookid is unique, so sending the first item
      }
    }
  });
});

app.get('/bucketuser', (req, res) => {
  const { userid, bookid } = req.query;
  db.query("SELECT * FROM cart_items WHERE userid = ? AND bookid = ?", [userid, bookid], (err, result) => {
      if (err) {
          console.error("Error checking bucket:", err);
          res.status(500).send("An error occurred while checking the bucket");
      } else {
          if (result.length > 0) {
              res.status(200).send({ exists: true });
          } else {
              res.status(200).send({ exists: false });
          }
      }
  });
});

app.post('/bucket', (req, res) => {
  try {
    const { userid, bookid } = req.body;

    // Check if the book already exists in the user's bucket
    db.query("SELECT * FROM cart_items WHERE userid = ? AND bookid = ?", [userid, bookid], (err, result) => {
      if (err) {
        console.error("Error checking bucket:", err);
        res.status(500).send("An error occurred while checking the bucket");
        return;
      }

      if (result.length > 0) {
        // If the book exists in the user's bucket, send a message back
        res.status(400).json({ message: 'This book is already in your bucket.' });
        return;
      }

      // If the book does not exist in the user's bucket, insert it
      const sql = `INSERT INTO cart_items (userid, bookid, book_title, cover_pdf, content_pdf, rental_price)
                   SELECT u.userid, b.bookid, b.book_title, b.cover_pdf, b.content_pdf, b.rental_price	
                   FROM users u
                   INNER JOIN books b ON u.userid = ? AND b.bookid = ?;`;

      db.query(sql, [userid, bookid], (err, result) => {
        if (err) {
          console.error('Error inserting data: ' + err.message);
          res.status(500).json({ message: 'Internal Server Error' });
          return;
        }

        console.log('Data inserted successfully');
        res.status(200).json({ message: 'Item added successfully' });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/Bookall' , (req, res) =>{
  db.query("SELECT * FROM books ", (err, result) => {
    if (err){
      console.log(err);
    }else{
      res.send(result);
    }
  })
})

app.get('/bucketusers', (req, res) => {
  const { userid } = req.query; // ไม่ต้องใช้ bookid ในการตรวจสอบ
  db.query("SELECT * FROM cart_items WHERE userid = ?", [userid], (err, result) => {
      if (err) {
          console.error("Error checking bucket:", err);
          res.status(500).send("An error occurred while checking the bucket");
      } else {
          res.status(200).send(result); // ส่งผลลัพธ์ทั้งหมดที่พบกลับไป
      }
  });
});

app.delete('/delete/:userid/:bookid', (req, res) => {
  const userid = req.params.userid;
  const bookid = req.params.bookid;

  console.log('Received deletion request for userid:', userid, 'and bookid:', bookid);

  db.query("DELETE FROM cart_items WHERE userid = ? AND bookid = ?", [userid, bookid], (err, result) => {
      if (err) {
          console.error("Error deleting item from bucket:", err);
          res.status(500).send("An error occurred while deleting the item from the bucket");
      } else {
          console.log('Deletion successful');
          res.status(200).send('Item removed from bucket successfully');
      }
  });
});



app.listen('3001', () => {
  console.log('Server is running on port 3001');
})


