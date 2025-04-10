require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { authenticateUser } = require('./middleware/auth');

const app = express();

app.use(express.json());
app.use(cors());

const pokerlyticsRoutes = require('./routes/pokerlyticsRoutes');
app.use('/pokerlytics', pokerlyticsRoutes);

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Pokerlytics API is running...');
});

// Example of using authentication middleware directly
app.get('/protected-data', authenticateUser, (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
