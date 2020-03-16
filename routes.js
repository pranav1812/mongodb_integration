const express= require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const helmet=require('helmet')
const path=require('path')
const bcrypt=require('bcrypt')
const sessions=require('client-sessions');

const router= express.Router()

router.use(sessions({
    cookieName:"session",
    duration: 5*60*1000,
    secret:"wtfitstopsecretbsdk",
    httpOnly:true
}))


router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended:true}))

router.use(helmet())
router.use(express.static(path.join(__dirname,'public')));
mongoose.connect('mongodb://localhost/revision',{ useNewUrlParser: true,useUnifiedTopology: true  })
const authSchema=mongoose.Schema({
    name:String,
    username:String,
    password:String,
    genere: String,
    email: String
})

const blogSchema=mongoose.Schema({
    heading:String,
    content:String
})

const User= mongoose.model('User',authSchema);
const Blog=mongoose.model('Blog',blogSchema);

router.get('/hello',(req,res)=>{
    res.render('auth',{
        ren: 'hello'
    })
})

router.get('/signup',(req,res)=>{
    res.sendFile('/root/Desktop/web_dev/try/public/signup.html');
})

router.post('/signup',(req,res)=>{
    //res.send(req.body)
    var hash=bcrypt.hashSync(req.body.password,14);
    req.body.password=hash;
    var user=new User(req.body)
    user.save()
        .then((data)=>console.log(data))
        .catch(err=>{
            console.log(err)
        })
    res.send(user)
})

router.get('/login',(req,res)=>{
    res.sendFile('/root/Desktop/web_dev/try/public/login.html');
})
router.post('/login',(req,res)=>{
    console.log(req.body.username)
    User.findOne({username:req.body.username},(err,data)=>{
        console.log(`searching ${req.body.username}`)
        if(err || !data){
            console.log("user not found");
            res.sendFile('/root/Desktop/web_dev/try/public/login.html');

        }else{
            console.log(bcrypt.compareSync(req.body.password,data.password))

            if(bcrypt.compareSync(req.body.password,data.password)==false){
                console.log("password and username don't match");
                res.sendFile('/root/Desktop/web_dev/try/public/login.html');

            }
            else{
                req.session.props=data;
                console.log(data);
                console.log(req.session.props)
                Blog.find({},(err,blog)=>{
                    res.render('dashboard',{
                        userinfo:JSON.stringify(req.session.props),
                        ren:blog
                    })
                })
            }
        }
    })
})

router.get('/dashboard',(req,res)=>{
    Blog.find({},(err,obj)=>{

    })
})

router.get('/write',(req,res)=>{
    console.log(req.session.props.username)
    res.render('write')
})
router.post('/writeblog',(req,res)=>{

    console.log(req.session.props._id)
    var blog= new Blog(req.body);
    blog.save()
        .catch(err=> console.log('err occured'))
    Blog.find({},(err,obj)=>{
        if(err) console.log('err occured')
        else{
            console.log(obj[1].heading)
            res.render('dashboard',{
                userinfo:req.session.props._id,
                ren:obj
            })
        }
    })

})

module.exports=router