const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port  = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:false}));
app.use('/add-product',(req,res,next)=>{
    res.send('<form action="/product" method="post"><input name="title"><button type="submit">add</button></form');
});
app.post('/product',(req,res,next)=>{
    console.log(req.body);
    res.send('<h1>Product Page</h1>');
});
app.use('/',(req,res,next)=>{
    res.send('<h1>Hello Express Application</h1>')
});
app.listen(port,()=>{
    console.log('Server is running on ',port);
});