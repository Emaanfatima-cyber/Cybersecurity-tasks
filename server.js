const express=require('express');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const helmet=require('helmet');
const bodyParser=require('body-parser');

const app=express();
const PORT=3000;
const SECRET='SuperSecretJWTKey';

app.use(helmet());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

let users=[];
let volunteers=[];

app.post('/signup',async(req,res)=>{
 const {username,password}=req.body;
 const hashed=await bcrypt.hash(password,10);
 users.push({username,password:hashed});
 res.send('Signup Successful');
});

app.post('/login',async(req,res)=>{
 const {username,password}=req.body;
 const user=users.find(u=>u.username===username);
 if(!user) return res.status(400).send('User not found');

 const match=await bcrypt.compare(password,user.password);
 if(!match) return res.status(401).send('Invalid password');

 const token=jwt.sign({username:user.username},SECRET,{expiresIn:'1h'});
 res.send('JWT Token: '+token);
});

app.post('/volunteer',(req,res)=>{
 volunteers.push(req.body);
 res.send('Volunteer Form Submitted');
});

app.listen(PORT,()=>{
 console.log(`Server running on http://localhost:${PORT}`);
});
