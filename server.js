const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt'); // For password hashing

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Your MySQL password
    database: 'signupjs' // Database name
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

app.post('/signup', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // Check if password and confirm password match
    if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match.");
    }

    // Optional: Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, hashedPassword], (err, result) => {
        if (err) {
            res.status(500).send('Database insertion error');
            return;
        }
        res.status(200).send('User registered successfully');
    });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
