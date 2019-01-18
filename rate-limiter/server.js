const IP = '127.0.0.1';
const PORT = '8080';

var express = require('express')
var _ = require('lodash');
var app = express();

const rateLimit = require("express-rate-limit");
const greyIPList = {
    _whiteList : [],
    _blackList: [
      {
        "ip": "",
        "addedOn": "",
        "type": "",
        "exceedCountDay": "",
        "exceedCountTotal" : ""
      }
    ],
    _allowedBots: [
      {
        "id": "",
        "ipList": {
          "knownIPList": [],
          "dynamicIPList": []
        },
        "isNameServerCheckRequired" : false,
        "nameServer": [],
        "userAgent": []
      }
    ],
    updateBlackListIP: function(){},
    updateWhiteListIP : function(){},
    isBlackListed : function(ip){},
    isWhiteListed : function(ip){
        
    },
    addToBlackList: function(ip){},
    addToWhiteList : function(ip){}
  }
const reqConfig = {
    whiteList : [
        '127.0.0.2',
        '127.0.0.4',
    ]
}
app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

const limiter = rateLimit({
  windowMs: 500, // 500ms
  max: 15, 
  skip: function (req, res) {
    var reqIP = req.ip;
    if(greyIPList.isWhiteListed(reqIP)) return true;
    else{
        if(greyIPList.isBlackListed(reqIP)){
            // increase Daily hit
            // is Dailyhit Limit reached
                // TURE [ res.send (501) ]
                // FALSE [ res.send(Google Captcha Evaluation) ]
        } else {
            // is it a allowed Bot
                // TRUE [ ADD to whitelist ] ,[ return true ]
                // FALSE [ greyIPList.addToBlackList(reqIP) ] [ res.send(Google Captcha Evaluation)]
        }
        
    }

  }
});

//  apply to all requests
app.use(limiter);

var startTime = new Date(); 

function timeDiffSec(time){
    return (time.getTime() - startTime.getTime()) /1000
}

app.get('/*', function(req, res){
    var endTime = new Date();
    console.log(`${req.connection.remoteAddress}`)
    res.send('Hello, I am a nice guy, I hope you dont bully me :) ');
    console.log('-----------------------------------------------------')
})

app.listen(PORT, IP, function(err){
    if(err) throw err;
    console.log(`Service Listening at ${IP}:${PORT}`)
})

