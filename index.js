const express = require('express')

const db = require('./data/db.js');
const postRouter = require('./data/post-router.js')

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('api home')
})

server.use('/api/posts', postRouter);

const port = 5000;

server.listen(port, ()=> {console.log(`n** API on port ${port}**/n`)})