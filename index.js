const express= require('express')
const path=require('path')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const helmet=require('helmet')
const router=require('./routes')
const app=express()


app.use('/',router)
app.use(express.static(path.join(__dirname,'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true, useUnifiedTopology: true}))

app.use(helmet())

app.set('views','./views');
app.set('view engine','pug');

mongoose.connect('mongodb://localhost/revision',{ useNewUrlParser: true })
    .then(()=>console.log('connected to the database '))

app.listen(3001)