app.post('/api/categories', (req, res) => {
    const { name, description } = req.body; 
    const sql = 'INSERT INTO categories (name, description) VALUES (?, ?)';
    db.query(sql, [name, description], (err, result) => {
      if (err) {
        throw err;
      }
      console.log('New category added:', result.insertId);
      res.json({ message: 'Category added successfully' });
    });
  });