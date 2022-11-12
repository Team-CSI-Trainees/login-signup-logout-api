const express=require('express');
const mongoose= require('mongoose');
const bodyparser=require('body-parser');
const cookieParser=require('cookie-parser');
const db=require('./config/config').get(process.env.NODE_ENV);
const app=express();
const User=require('./models/user');
const {auth}=require('./middlewares/auth');

app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());
app.use(cookieParser());
mongoose.Promise=global.Promise;
mongoose.connect(db.DATABASE,{useNewUrlParser:true,useUnifiedTopology:true},function(err){
  if(err) console.log(err);
  console.log("Database is connected");
});

app.get('/',function(req,res){
    res.status(200).send(`Welcome to login , sign-up api`);
});
const userSchema=mongoose.Schema({
  firstname:{
        type: String,
        required: true,
        maxlength: 100
    },
    lastname:{
        type: String,
        required: true,
        maxlength: 100
    },
    rollno:{
      type:Number,
      required:true,
      maxlength:30
    },
    year:{
      type:Number,
      required:true,
      maxlength:4
    },
    branch:{
      type:String,
      required:true,

    },
    mobno:{
      type:Number,
      maxlength:10,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    password:{
        type:String,
        required: true,
        minlength:8
    },
    password2:{
        type:String,
        required: true,
        minlength:8

    },
    token:{
        type: String
    }
});
userSchema.pre('save'function(next){
  var user=this;
  if(user.isModified('password')){
    bcrypt.genSalt(salt,function(err,salt){
      if(err) return next(err);
      bcrypt.hash(user.password,salt,function(err,hash){
        if(err) return next(err);
        user.password=hash;
        user.password2=hash;
        next();
      }
    })
  }
  else{
    next();
  }
});
module.exports=mongoose.model('User',userSchema);


const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`app is live at ${PORT}`);
});
