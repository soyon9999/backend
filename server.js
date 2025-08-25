const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());

app.get('/api/search', (req, res) => {
    const query = (req.query.q || '').toLowerCase();
    
    const dbPath = path.join(__dirname, 'db.json');
    
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading db.json:", err);
            return res.status(500).json({ error: 'Failed to read database' });
        }
        
        try {
            const jsonData = JSON.parse(data);
            const movies = jsonData.movies || [];
            
            if (!query) {
                return res.json([]);
            }
            
            const results = movies.filter(movie => 
                movie.title.toLowerCase().includes(query)
            );
            
            res.json(results);
        } catch (parseErr) {
            console.error("Error parsing db.json:", parseErr);
            return res.status(500).json({ error: 'Failed to parse database' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
