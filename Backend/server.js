import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Server } from 'socket.io';
import http from 'http';

const { Pool } = pkg;

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'voting_app',
    password: '1765',
    port: 5432,
});
pool.connect()
  .then(() => console.log('Connected to PostgreSQL database successfully'))
  .catch(err => console.error('Database connection error:', err));

const JWT_SECRET = 'a58d00a16c6c036401ed6956581f21ea46aadbc91523f36993fb1212b857bff35b4d54fddd766b47149bb92ee5dacd5f71e12f47eaa861f4691e20b9c4254efd3d379852e47e76b5c2e5e7434727ba683e0ec9bd8f29b7f4f2173c89e691133720e9e0616e692319d330e6073ddb3400ba82d6c168a14997ded90e90a3c4a0eaa6573bfb2490c77e7359daa6133441adc4bd2a2f6658103b274c27403537600d9e6b716ca56e238713de2e971bc466f2a4d7f68b9461755207f2555115e81c0f86ee59717a5d5c34c65788b91801b662a0c3e7289270046ee2070957dbeb7b258f4986bb0230833b3eba5a0afae70bb85e1e835bee6f579b9852bdb8a90d33402c288bd8538abb7ac2ee112cb0f7f90825ee91393e1f95b8adac93eef0846785';

// User Registration
app.post('/register', async (req, res) => {
  const { username, password, isAdmin } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password, is_admin) VALUES ($1, $2, $3) RETURNING id',
      [username, hashedPassword, isAdmin]
    );
    res.json({ userId: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: 'User registration failed' });
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) return res.status(400).json({ error: 'User not found' });
    
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.rows[0].id, isAdmin: user.rows[0].is_admin }, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Create Poll (Admin only)
app.post('/create-poll', async (req, res) => {
  const { title, options } = req.body;
  const pollCode = Math.random().toString(36).substr(2, 6).toUpperCase();

  try {
    const poll = await pool.query('INSERT INTO polls (title, code) VALUES ($1, $2) RETURNING id', [title, pollCode]);
    const pollId = poll.rows[0].id;
    
    for (const option of options) {
      await pool.query('INSERT INTO options (poll_id, option_text) VALUES ($1, $2)', [pollId, option]);
    }
    
    res.json({ pollId, pollCode });
  } catch (err) {
    res.status(500).json({ error: 'Poll creation failed' });
  }
});

// Submit Vote
app.post('/vote', async (req, res) => {
  const { pollCode, optionId } = req.body;
  try {
    await pool.query('INSERT INTO votes (option_id) VALUES ($1)', [optionId]);
    io.emit('voteUpdate', { pollCode });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Voting failed' });
  }
});

server.listen(5010, () => console.log('Server running on port 5010'));
