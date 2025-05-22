require('dotenv').config({path: __dirname + '/../.env'});
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');
const db = require('./database');
const { roleModel, userModel, refreshTokenModel} = require("./models/associations");
const path = require('path');

const PORT = process.env.PORT || 5000;
const app = express();


app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "https://agronet.onrender.com", 
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
}));

app.use('/api', router);

app.use(express.static(path.resolve(__dirname, '../../frontend/dist')));


app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.resolve(__dirname, '../../frontend/dist/index.html'));
  }
});

app.use(errorMiddleware);

const start = async () => {
    try {
        await db.sync({alter:true});
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start()
