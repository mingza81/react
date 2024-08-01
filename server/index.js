const mysql = require('mysql');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid')
const stripe = require('stripe')('sk_test_51P57HzRwtyPChAqiQGvWy3SNiG8MM0oKHCJ9S7B33NEVQmJZjGYMlZ6Sm2mBLq4duehSjoNu6l6BbQ1ZEGJwhKr900b1MzSFyY');
const express = require('express');
const app = express();
const multer = require('multer') 
const bodyParser = require('body-parser');
app.use('/webhook',bodyParser.raw({type: 'application/json'}));

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    return cb(null, "./images")
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`)
  }
})
 
const upload = multer({storage})

var path = require('path');
var public = path.join(__dirname, './images'); 
app.use(express.static(public));

app.use(cors());
app.use(express.json());



const endpointSecret = "whsec_d409ec097551993dd21d3eeea0d3ec75d4d530756d6cd9206fbc66908e0006e8";

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "bookshop"
})

app.post('/api/checkout',express.json(), async (req, res) => {
  const { user, product } = req.body;
  try {
      const orderId = uuidv4();
      const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
              {
                  price_data: {
                      currency: "thb",
                      product_data: {
                          name: product.name,
                      },
                      unit_amount: product.price * 100,
                  },
                  quantity: product.quantity,
              },
          ],
          mode: "payment",
          success_url: `http://localhost:3000/success/?id=${orderId}`,
          cancel_url: `http://localhost:3000/cancle/?id=${orderId}`,
      });
      session.payment_status = 'complete';
      console.log("session", session);

      const data = {
          fullname: user.name,
          session_id: session.id,
          status: session.status,
          order_id: orderId
      };

      db.query('INSERT INTO orders SET ?', data, (error, result) => {
          if (error) {
              console.error(error);
              return res.status(500).json({
                  message: 'Database error',
                  error: error.message
              });
          }
          
          // Send response with inserted row details
          res.json({
            message: "Checkout success.",
            user,
            product,
            sessionid :session.id,
          });
      });
      if (session.payment_status === 'complete') {
        db.query('UPDATE orders SET status = ? WHERE order_id = ?', ['complete', orderId], (error, result) => {
            if (error) {
                // Handle the error appropriately
                console.error('Error updating order status:', error);
            } else {
                // Optionally handle success response
                console.log('Order status updated successfully:', result);
            }
        });

        // Insert data into mybook table
        db.query(`INSERT INTO mybook (bookid, userid, book_title, cover_pdf, category, story_pdf)
                SELECT ci.bookid, ci.userid, b.book_title, b.cover_pdf, b.category, b.story_pdf
                FROM cart_items ci
                JOIN books b ON ci.bookid = b.bookid`, (error, result) => {
            if (error) {
                // Handle the error appropriately
                console.error('Error inserting data into mybook:', error);
            } else {
                // Optionally handle success response
                console.log('Data inserted into mybook successfully:', result);
            }
        });
        db.query(`INSERT INTO history (userid, book_title, category, rental_price)
                SELECT ci.userid, b.book_title, b.category, b.rental_price
                FROM cart_items ci
                JOIN books b ON ci.bookid = b.bookid`, (error, result) => {
            if (error) {
                // Handle the error appropriately
                console.error('Error inserting data into mybook:', error);
            } else {
                // Optionally handle success response
                console.log('Data inserted into mybook successfully:', result);
            }
        });

    }
  } catch (error) {
      console.error(error);
      res.status(400).json({
          message: 'Something went wrong',
          error: error.message
      });
  }
  
});

app.get('/api/order/:id', async (req, res) => {
  const orderId = req.params.id;
  try {
      db.query('SELECT * from orders where order_id = ?', orderId, (error, result) => {
          if (error) {
              console.error('Error retrieving order:', error);
              return res.status(500).json({
                  message: 'Internal server error',
                  error: error.message
              });
          }
          if (!result.length) {
              return res.status(404).json({ message: 'Order not found' });
          }
          const orderResult = result[0]
          res.json({order : orderResult});
      });
  } catch (error) {
      console.error('Error retrieving order:', error);
      res.status(500).json({
          message: 'Internal server error',
          error: error.message
      });
  }
});

app.post('/webhook', express.raw({type: 'application/json'}),async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  
  switch (event.type) {
    case 'checkout.session.completed':
      const paymentSuccessData = event.data.object;
      const sessionId = paymentSuccessData.id;

      const data = {
        status: paymentSuccessData.status,
      };
      const result = await db.query("UPDATE orders SET ? WHERE session_id = ?", [
        data,
        sessionId,
      ]);
      console.log("=== update result", result);
      
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  
  res.send();
});



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

app.delete('/deletee/:userid/', (req, res) => {
  const userid = req.params.userid;

  console.log('Received deletion request for userid:', userid);

  db.query("DELETE FROM cart_items WHERE userid = ? ", [userid], (err, result) => {
      if (err) {
          console.error("Error deleting item from bucket:", err);
          res.status(500).send("An error occurred while deleting the item from the bucket");
      } else {
          console.log('Deletion successful');
          res.status(200).send('Item removed from bucket successfully');
      }
  });
});




app.post('/bookselling',upload.single('file'), (req, res) => {
  const sql = "INSERT INTO selling_cus (`email`,`book_title`, `content_pdf`,`cover_pdf`,`category`,`author`,`rental_price`,`status`) VALUES (?)"; 
  const values = [
      req.body.email,
      req.body.book_title,
      req.body.content_pdf,
      req.file.filename, 
      req.body.category, 
      req.body.author,
      req.body.rental_price,
      req.body.status, 
  ]
  db.query(sql, [values], (err, result) => {
      if(err) return res.json({Error: "Error singup query"});
      return res.json({Status: "Success"});
  })
})

app.get('/examine', (req, res) => {
  db.query("SELECT email, book_title, cover_pdf, content_pdf, category, author, rental_price, status FROM selling_cus", (err, result) => {
    
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred while fetching data");
    } else {
      res.send(result);
    }
  });
});

app.get('/history/:userid', (req, res) => {
  const userid = req.params.userid;
  db.query("SELECT book_title, category, rental_price, buydate FROM history WHERE userid = ?",[userid], (err, result) => {
    
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred while fetching data");
    } else {
      res.send(result);
    }
  });
});

app.get('/mybook/:userid', (req, res) => {
  const userid = req.params.userid;
  db.query("SELECT bookid ,book_title, cover_pdf, category, story_pdf, datebook FROM mybook WHERE userid = ?",[userid], (err, result) => {
    
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred while fetching data");
    } else {
      res.send(result);
    }
  });
});
app.get('/mybooks/:bookid', (req, res) => {
  const bookid = req.params.bookid;
  db.query("SELECT book_title, cover_pdf, category, story_pdf, datebook FROM mybook WHERE bookid = ?",[bookid], (err, result) => {
    
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred while fetching data");
    } else {
      res.send(result);
    }
  });
});

app.get('/userbook', (req, res) => {
  const { userid, bookid } = req.query;
  db.query("SELECT * FROM mybook WHERE userid = ? AND bookid = ?", [userid, bookid], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred while fetching data");
    } else {
      res.send(result);
    }
  });
});

app.get('/historymoney', (req, res) => {
  const category = req.query.category;
  let query = "SELECT * FROM history";
  let queryParams = [];

  if (category) {
    query += " WHERE category = ?";
    queryParams.push(category);
  }

  db.query(query, queryParams, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred while fetching data");
    } else {
      res.send(result);
    }
  });
});




app.listen('3001', () => {
  console.log('Server is running on port 3001');
})


