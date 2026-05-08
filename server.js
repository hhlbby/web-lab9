const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const restRoutes = require('./rest');
const initSocket = require('./socket');

const app = express();
const server = http.createServer(app);

initSocket(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', restRoutes);

app.get('/chat', (req, res) => {
    res.render('chat');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});