const express = require('express');
const cors = require('cors');
const taskRouter = require('./routes/tasks'); 

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/tasks', taskRouter);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

module.exports = app;