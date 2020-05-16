const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const { MONGOURI } = require('./Config/key');
const cors = require('cors');

require('./models/user');
require('./models/post');



mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
    console.log('connected to mongo yehh')
})
mongoose.connection.on('error', (err) => {
    console.log('err connecting', err);
})

app.use(cors());
app.use(express.json());
app.use(require('./routes/user'));
app.use(require('./routes/auth'));
app.use(require('./routes/post'));

if(process.env.NODE_ENV=="production"){
    app.use(express.static('cmyinstagramcloneproject/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'cmyinstagramcloneproject','build','index.html'))
    })
}


app.listen(PORT, () => {
    console.log('server is running at ', PORT);
})