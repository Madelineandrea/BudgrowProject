const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'budgrow'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    process.exit(1); 
  }
  console.log('Connected to database.');
});

  // Endpoint buat nge-fetching groceries dari db user
app.get('/search/groceries', async (req, res) => {
    const searchKey = req.query.q;
    const groceryQuery = `
      SELECT 
        groceryName, 
        brand, 
        weight, 
        groceryPrice, 
        imageURL
      FROM 
        GroceryItem
      WHERE 
        groceryName LIKE ?;
    `;
  
    try {
      const groceryResults = await new Promise((resolve, reject) => {
        db.query(groceryQuery, [`%${searchKey}%`], (err, results) => {
          if (err) {
            console.error('Error fetching grocery items:', err);
            reject(err);
          } else {
            console.log('Grocery Results:', results);
            resolve(results);
          }
        });
      });
  
      const modifiedGroceryResults = groceryResults.map(result => {
        result.imageURL = `https://drive.google.com/drive/u/1/folders/1HUQzF75c84bgRE_e_Edz76TIKTCtnsCJ/${searchKey}.png`;
        return result;
      });
  
      res.json(modifiedGroceryResults);
    } catch (err) {
      console.error('Error fetching grocery items:', err.stack);
      res.status(500).json({ error: 'Error fetching grocery items' });
    }
  });
  
  // Endpoint buat nge-fetching store products
  app.get('/search/stores', async (req, res) => {
    const searchKey = req.query.q;
    const storeQuery = `
      SELECT 
        storeProductName, 
        storePrice
      FROM 
        StoreProduct
      WHERE 
        storeProductName LIKE ?;
    `;
  
    try {
      const storeResults = await new Promise((resolve, reject) => {
        db.query(storeQuery, [`%${searchKey}%`], (err, results) => {
          if (err) {
            console.error('Error fetching store products:', err);
            reject(err);
          } else {
            console.log('Store Results:', results);
            resolve(results);
          }
        });
      });
  
      res.json(storeResults);
    } catch (err) {
      console.error('Error fetching store products:', err.stack);
      res.status(500).json({ error: 'Error fetching store products' });
    }
  });

// Endpoint baru untuk data di analytics
app.post('/analytics', (req, res) => {
    const { items, total } = req.body;
    const productCategory = 'Grocery'; 
    const totalQuantity = items.reduce((sum, item) => sum + parseFloat(item.quantity), 0);
  
    const query = `
      INSERT INTO Analytics (productCategory, totalSpent, totalQuantity)
      VALUES (?, ?, ?)`;
  
    db.query(query, [productCategory, total, totalQuantity], (err, result) => {
      if (err) {
        console.error('Error inserting data into analytics:', err.stack);
        res.status(500).json({ error: 'Error inserting data into analytics' });
        return;
      }
      res.json({ message: 'Data successfully added to analytics', analyticsID: result.insertId });
    });
  });
  
// Endpoint untuk search data produk berdasarkan groceryID
app.get('/search', (req, res) => {
    const searchKey = req.query.q;
    const query = `
      SELECT groceryName, brand, weight, groceryPrice
      FROM GroceryItem
      WHERE groceryName LIKE ?`;
  
    db.query(query, [`%${searchKey}%`], (err, results) => {
      if (err) {
        console.error('Error fetching product:', err.stack);
        res.status(500).json({ error: 'Error fetching product' });
        return;
      }
      res.json(results);
    });
  });
  

// Endpoint untuk tampilin data produk 
app.get('/product', (req, res) => {
  const searchKey = req.query.q;
  const query = `
    SELECT *
    FROM 
        Store
    ;`

  db.query(query, [`%${searchKey}%`], (err, results) => {
    if (err) {
      console.error('Error fetching product:', err.stack);
      res.status(500).json({ error: 'Error fetching product' });
      return;
    }
    res.json(results);
  });
});

// Endpoint untuk tampilin data grocery user yang udah dipilih
app.get('/search/groceries', async (req, res) => {
    const searchKey = req.query.q;
    const groceryQuery = `
      SELECT 
        groceryName, 
        brand, 
        weight, 
        groceryPrice, 
        imageURL
      FROM 
        GroceryItem
      WHERE 
        groceryName LIKE ?;
    `;
  
    try {
      const groceryResults = await new Promise((resolve, reject) => {
        db.query(groceryQuery, [`%${searchKey}%`], (err, results) => {
          if (err) {
            console.error('Error fetching grocery items:', err);
            reject(err);
          } else {
            console.log('Grocery Results:', results);
            resolve(results);
          }
        });
      });
  
      const modifiedGroceryResults = groceryResults.map(result => {
        result.imageURL = `https://drive.google.com/drive/u/1/folders/1HUQzF75c84bgRE_e_Edz76TIKTCtnsCJ/${searchKey}.png`;
        return result;
      });
  
      res.json(modifiedGroceryResults);
    } catch (err) {
      console.error('Error fetching grocery items:', err.stack);
      res.status(500).json({ error: 'Error fetching grocery items' });
    }
  });
  
  // Endpoint untuk mengambil store products
  app.get('/search/stores', async (req, res) => {
    const searchKey = req.query.q;
    const storeQuery = `
      SELECT 
        storeProductName, 
        storePrice
      FROM 
        StoreProduct
      WHERE 
        storeProductName LIKE ?;
    `;
  
    try {
      const storeResults = await new Promise((resolve, reject) => {
        db.query(storeQuery, [`%${searchKey}%`], (err, results) => {
          if (err) {
            console.error('Error fetching store products:', err);
            reject(err);
          } else {
            console.log('Store Results:', results);
            resolve(results);
          }
        });
      });
  
      res.json(storeResults);
    } catch (err) {
      console.error('Error fetching store products:', err.stack);
      res.status(500).json({ error: 'Error fetching store products' });
    }
  });

// Endpoint untuk menampilkan category
app.get('/category', (req, res) => {
    const query = `
      SELECT categoryName
      FROM 
          Category
      ;`
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching category:', err.stack);
        res.status(500).json({ error: 'Error fetching category' });
        return;
      }
      res.json(results);
    });
  });

  // Endpoint untuk menambahkan category baru
app.post('/category', (req, res) => {
    const { name } = req.body;
    const query = 
    'INSERT INTO category(categoryName) VALUES (?)';
    
    db.query(query, [name], (err, result) => {
      if (err) {
        console.error('Error adding category:', err.stack);
        res.status(500).json({ error: 'Error adding category' });
        return;
      }
      console.log('New category added:', result.insertId);
      res.status(200).json({ message: 'Category added successfully' });
    });
  });
  

  //Endpoint untuk menampilkan food type
  app.get('/type', (req, res) => {
    const category = req.query.category;
    const query = `
      SELECT g.groceryName
      FROM 
          groceryitem g 
          JOIN category c ON g.categoryID = c.categoryID
        WHERE c.categoryName = ?
      ;`
  
    db.query(query, [category], (err, results) => {
      if (err) {
        console.error('Error fetching type:', err.stack);
        res.status(500).json({ error: 'Error fetching type' });
        return;
      }
      res.json(results);
    });
  });


 //Endpoint untuk menambahakan detail
  app.post('/details', (req, res) => {
    const { foodType, brand, weight, groceryPrice, notes, imageURL } = req.body;
    const query = 
    'INSERT INTO groceryitem(groceryName, brand, weight, groceryPrice, notes, imageURL) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(query, [foodType, brand, weight, groceryPrice, notes, imageURL], (err, result) => {
      if (err) {
        console.error('Error adding detail:', err.stack);
        res.status(500).json({ error: 'Error adding details' });
        return;
      }
      console.log('New category added:', result.insertId);
      res.status(200).json({ message: 'Saved changes successfully' });
    });
  });

  app.put('/details', (req, res) => {
    const { foodType, brand, weight, groceryPrice, notes, imageURL } = req.body;
    const query = `
      UPDATE groceryitem
      SET brand = ?, weight = ?, groceryPrice = ?, notes = ?, imageURL = ?
      WHERE groceryName = ?`;
  
    db.query(query, [foodType, brand, weight, groceryPrice, notes, imageURL], (err, result) => {
      if (err) {
        console.error('Error updating details:', err.stack);
        res.status(500).json({ error: 'Error updating details' });
        return;
      }
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'No details found to update' });
      } else {
        res.json({ message: 'Details updated successfully' });
      }
    });
  });
  
  app.listen(3001, () => {
    console.log('Server is running on port 3001');
  });

    //Endpoint untuk menampilkan keterangan grocery
  app.get('/details', (req, res) => {
    const foodType = req.query.foodType;
    const query = `
      SELECT groceryName, brand, weight, groceryPrice, notes, imageURL
      FROM 
          groceryitem
        WHERE groceryName = ?
      ;`
  
    db.query(query, [foodType], (err, results) => {
      if (err) {
        console.error('Error fetching details:', err.stack);
        res.status(500).json({ error: 'Error fetching details' });
        return;
      }
      if (results.length > 0) {
        res.json(results[0]); 
      } else {
        res.status(404).json({ error: 'No details found' });
      }
    });
  });

  // Endpoint untuk menampilkan grocery items dari list
app.get('/grocery-list', (req, res) => {
    const query = `
      SELECT groceryName, weight, groceryPrice
      FROM groceryitem;
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching grocery list:', err.stack);
        res.status(500).json({ error: 'Error fetching grocery list' });
        return;
      }
      res.json(results);
    });
  });
  
  // Endpoint untuk menambahkan item ke grocery list
  app.post('/grocery-list', (req, res) => {
    const { userID, groceryName, weight, groceryPrice } = req.body;
    const query = `
    INSERT INTO grocerylist (userID, groceryID, quantity, totalPrice, isBought)
    VALUES (Mady, (SELECT groceryID FROM groceryitem WHERE groceryName = ?), ?, ?, false);
  `;
    const quantity = weight; 
    const totalPrice = groceryPrice; 
    const isBought = false;
    db.query(query, [userID, groceryID, groceryName, quantity, totalPrice, isBought], (err, result) => {
      if (err) {
        console.error('Error adding item to grocery list:', err.stack);
        res.status(500).json({ error: 'Error adding item to grocery list' });
        return;
      }
      console.log('Item added to grocery list:', result.insertId);
      res.status(200).json({ message: 'Item added to grocery list successfully' });
    });
  });
 
  app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
  });
  
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
  });

app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
