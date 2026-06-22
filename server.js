const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const {Server} = require('socket.io');
dotenv.config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {cors: {origin : '*'}});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log("error : ",err));

const userRoutes = require('./routes/users');
const spaceRoutes = require('./routes/spaces');

app.use('/routes/users', userRoutes);
app.use('/routes/spaces', spaceRoutes);

app.get('/', (req, res) => {
  res.send('Meeting Scheduler backend is running!');
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});