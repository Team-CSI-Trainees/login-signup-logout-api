const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const config=require('../config/config').get(process.env.NODE_ENV);
const salt=10;


userSchema.methods.comparepassword=function(password,cb){
  bcrypt.compare(password,this.password,function(err,isMatch){
    if(err) return cb(next);
    cb(null,isMatch);
  });
}
//generate jsonwebtoken
userSchema.methods.generateToken=function(cb){
  var user=this;
  var token jwt.sign(user._id.toHexString(),config.SECRET);
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
