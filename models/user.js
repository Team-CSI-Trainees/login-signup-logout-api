const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const config=require('../config/config').get(process.env.NODE_ENV);
const salt=10;
var mongoose= require('mongoose');
const userSchema=mongoose.Schema({
fullname:{
  type:String,
  required:true,
  maxlength:100
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
 //const validate=() =>{
  //var f=0;
  //String regex="^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$";
  //{boolean result=email.matches(regex);
  //if(result==true)
 //f=f+1},
  //String r="^[12][0-9]{3}$";
  //{
    //boolean re=year.matches(re);
    //if(result==true)
   //f=f+1,
// },
  //String n="^[A-Z][a-zA-Z]+$";
//{  boolean res=fullname.matches(n);
//  if(result==true)
 //f=f+1,
//},
//  String ph="^\\d{10}$";
  //{boolean phr=ph.matches(ph);
  //  if(result==true)
   //f=f+1,
 //},
  //String pas="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*&?])[A-Za-z\d@$!%*?&]{8,}$";
  //{boolean p=password.matches(pas);
  //  if(result==true)
  //  f=f+1,
  //},
  //if(f==5)

//}



userSchema.pre('save',function(next){
  var user=this;
  if(user.isModified('password')){
    bcrypt.genSalt(salt,function(err,salt){
      if(err) return next(err);
      bcrypt.hash(user.password,salt,function(err,hash){
        if(err) return next(err);
        user.password=hash;
        user.password2=hash;
        next();
      })
   })
  }
  else{
    next();
  }
});




userSchema.methods.comparepassword=function(password,cb){
  bcrypt.compare(password,this.password,function(err,isMatch){
    if(err) return cb(next);
    cb(null,isMatch);
  });
}
//generate jsonwebtoken
userSchema.methods.generateToken=function(cb){
  var user=this;
  var token=jwt.sign(user._id.toHexString(),config.SECRET);
  user.token=token;
  user.save(function(err,user){
    if(err) return cb(err);
    cb(null,user);
  })
}
//find by token
userSchema.statics.findByToken=function(token,cb){
  var user=this;
  jwt.verify(token,config.SECRET,function(err,decode){
  user.findOne({"_id":decode,"token":token},function(err,user){
    if(err) return cb(err);
    cb(null,user);
  })
  })
};
//delete token
userSchema.methods.deleteToken=function(token,cb){
  var user=this;
  user.update({$unset :{token :1}},function(err,user){
    if(err) return cb(err);
    cb(null,user);
  })
}
module.exports=mongoose.model('User',userSchema);
