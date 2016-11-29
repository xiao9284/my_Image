// //验证码
// /** 
// * Created by xzh on 2016/10/10. 
// */ 

// var captcha = require('captchapng'); 
// var cache = require('./redis-cache.js'); 
// var defCfg = require('../config/default-config.js'); 



// /** 
// * 生成验证码图片 
// * @param  {[Object]} req    [description] 
// * @param  {[number]} width  [description] 
// * @param  {[number]} height [description] 
// * @return {[Object]}        [返回json对象，包括验证码和验证码图片] 
// */ 
// exports.generate = function(req,width,height){ 
//    height = height || 30; 
//    width = width || 100; 
//    var cap =parseInt(Math.random()*9000+1000); 
//    var p = new captcha(width, height, cap); 

//    p.color(180, 180, 180, 100); // 前景色: background (red, green, blue, alpha) 
//    p.color(parseInt(Math.random() * 255), parseInt(Math.random() * 255), parseInt(Math.random() * 255), 255); //背景色 

//    var img = p.getBase64(); 
//    img = 'data:image/jpg;base64,' + img; 
//    //将验证码保存到缓存 
//    cache.set(req.sessionID, cap, defCfg.ExpireTime); 

//    //返回验证码数字和图片base64字符串 
//    return { 
//       key:req.sessionID, 
//       text:cap, 
//       img:img 
//    } 
// } 


// /** 
// * 检查验证码是否相同 
// * @param  {[type]} key     [description] 
// * @param  {[type]} captcha [description] 
// * @return {[type]}         [description] 
// */ 
// exports.checkCaptcha = function(key,captcha){ 
//    var tmpCap = cache.get(key); 
//    if(tmpCap == captcha){ 
//       cache.del(key); 
//       return true; 
//    }else{ 
//       return false; 
//    } 
// }