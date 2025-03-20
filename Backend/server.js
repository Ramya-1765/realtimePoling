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
// User Registration
app.post('/register', async (req, res) => {
    const { username, password, isAdmin } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const result = await pool.query(
        'INSERT INTO users (username, password, is_admin) VALUES ($1, $2, $3) RETURNING id, is_admin',
        [username, hashedPassword, isAdmin]
      );
      res.json({ userId: result.rows[0].id, isAdmin: result.rows[0].is_admin });
    } catch (err) {
      res.status(500).json({ error: 'User registration failed' });
    }
  });
  
// User Login
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
//     if (user.rows.length === 0) return res.status(400).json({ error: 'User not found' });
    
//     const isMatch = await bcrypt.compare(password, user.rows[0].password);
//     if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    
//     const token = jwt.sign({ id: user.rows[0].id, isAdmin: user.rows[0].is_admin }, JWT_SECRET);
//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ error: 'Login failed' });
//   }
// });
// User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  
      if (user.rows.length === 0) return res.status(400).json({ error: 'User not found' });
  
      const isMatch = await bcrypt.compare(password, user.rows[0].password);
      if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
  
      const token = jwt.sign(
        { id: user.rows[0].id, isAdmin: user.rows[0].is_admin },
        JWT_SECRET
      );
  
      res.json({ token, isAdmin: user.rows[0].is_admin });
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
// Get Poll by Code
app.get('/poll/:code', async (req, res) => {
    const { code } = req.params;
  
    try {
      // Fetch poll details
      const pollResult = await pool.query('SELECT * FROM polls WHERE code = $1', [code]);
      if (pollResult.rows.length === 0) {
        return res.status(404).json({ error: 'Invalid poll code' });
      }
  
      const poll = pollResult.rows[0];
  
      // Fetch poll options
      const optionsResult = await pool.query('SELECT * FROM options WHERE poll_id = $1', [poll.id]);
      poll.options = optionsResult.rows;
  
      res.json(poll);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch poll' });
    }
  });
  
// Submit Vote
// app.post('/vote', async (req, res) => {
//   const { pollCode, optionId } = req.body;
//   try {
//     await pool.query('INSERT INTO votes (option_id) VALUES ($1)', [optionId]);
//     io.emit('voteUpdate', { pollCode });
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: 'Voting failed' });
//   }
// });
// 🟢 Emit Real-Time Poll Updates
// app.post('/vote', authenticateUser, async (req, res) => {
//     const { pollCode, optionId } = req.body;

//     try {
//         const pollResult = await pool.query('SELECT * FROM polls WHERE code = $1', [pollCode]);
//         if (pollResult.rows.length === 0) return res.status(400).json({ error: 'Invalid poll code' });

//         await pool.query('INSERT INTO votes (option_id) VALUES ($1)', [optionId]);

//         // Fetch updated results
//         const results = await pool.query(
//             `SELECT options.id, options.option_text, COUNT(votes.id) AS vote_count
//             FROM options 
//             LEFT JOIN votes ON options.id = votes.option_id
//             WHERE options.poll_id = $1
//             GROUP BY options.id`,
//             [pollResult.rows[0].id]
//         );

//         // Send update to all connected clients (including admin dashboard)
//         io.emit('voteUpdate', { pollCode, results: results.rows });

//         res.json({ success: true });
//     } catch (err) {
//         res.status(500).json({ error: 'Voting failed' });
//     }
// });
app.post('/vote', async (req, res) => {
    const { code, optionId } = req.body;

    try {
        await pool.query('INSERT INTO votes (option_id) VALUES ($1)', [optionId]);

        // Fetch updated results
        const pollQuery = await pool.query('SELECT id FROM polls WHERE code = $1', [code]);
        if (pollQuery.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid poll code' });
        }

        const pollId = pollQuery.rows[0].id;
        const results = await pool.query(`
            SELECT options.id, options.option_text, COUNT(votes.id) AS vote_count
            FROM options
            LEFT JOIN votes ON options.id = votes.option_id
            WHERE options.poll_id = $1
            GROUP BY options.id, options.option_text
        `, [pollId]);

        io.emit('voteUpdate', { code, results: results.rows });

        res.json({ success: true });
    } catch (err) {
        console.error('Error submitting vote:', err);
        res.status(500).json({ error: 'Voting failed' });
    }
});

// 📊 **Fetch Poll Results (Admin Only)**

// app.get('/poll-results/:code', async (req, res) => {
//     const { code } = req.params;
//     try {
//         // Fetch poll title
//         const pollQuery = await pool.query('SELECT * FROM polls WHERE code = $1', [code]);
//         if (pollQuery.rows.length === 0) {
//             return res.status(404).json({ error: 'Poll not found' });
//         }

//         const pollTitle = pollQuery.rows[0].title;

//         // Fetch poll options with vote count
//         const results = await pool.query(`
//             SELECT options.id, options.option_text, COUNT(votes.id) AS vote_count
//             FROM options
//             LEFT JOIN votes ON options.id = votes.option_id
//             WHERE options.poll_id = $1
//             GROUP BY options.id, options.option_text
//         `, [pollQuery.rows[0].id]);

//         res.json({ pollTitle, options: results.rows });
//     } catch (err) {
//         console.error('Error fetching poll results:', err);
//         res.status(500).json({ error: 'Failed to fetch poll results' });
//     }
// });
// Fetch poll results by poll code
app.get('/poll-results/:code', async (req, res) => {
    const { code } = req.params;

    try {
        // Find the poll by its unique code
        const poll = await pool.query('SELECT id, title FROM polls WHERE code = $1', [code]);

        if (poll.rows.length === 0) {
            return res.status(404).json({ error: "Poll not found" });
        }

        const pollId = poll.rows[0].id;
        const pollTitle = poll.rows[0].title;

        // Fetch poll options and their vote counts
        const options = await pool.query(
            `SELECT options.id, options.option_text, 
                    COUNT(votes.id) AS vote_count
             FROM options
             LEFT JOIN votes ON options.id = votes.option_id
             WHERE options.poll_id = $1
             GROUP BY options.id`,
            [pollId]
        );

        res.json({ pollTitle, options: options.rows });
    } catch (err) {
        console.error("❌ Error fetching poll results:", err);
        res.status(500).json({ error: "Failed to fetch poll results" });
    }
});


server.listen(5010, () => console.log('Server running on port 5010'));
