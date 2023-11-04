import express from 'express';
import mongoose from 'mongoose';
import { DB_URL } from './config/db.js';
import * as route from './routes/index.js';
import User from './models/user.js';
import Author from './models/author.js';
import protectedRequest from './middleware/protect-api.js';

const app = express();
const port = 4000;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  res.send('express + typescript');
});

// clear collection
app.get('/clear', async (req, res) => {
  await User.deleteMany();
  await Author.deleteMany();
  res.send('cleared all collection');
});

// route lists
app.use('/auth', route.auth);
app.use('/authors', protectedRequest, route.author);
app.use('/article', protectedRequest, route.article);

mongoose
  .connect(DB_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });