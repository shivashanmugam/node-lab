const require = 'ip-cidr';

const greyIPList = {
    _white:[],
    _black: [],
    _allowedBots: [
      {
        "id": "",
        "category": {
          "knownIP": [],
          "dynamicIP": []
        },
        "isNameServerCheckRequired" : false,
        "nameServer": [],
        "userAgent": []
      }
    ],
    generateWhiteList : function(){
        // MIGHT NEED TO ADD IP LIST THROUGH SUBNET MASK
        _.each(this._allowedBots, function(bot){
            this.white.concat(bot.category.knownIP).concat(bot.category.dynamicIP)
        })
    },
    isWhite : function(ip){
        // handle SUBNET MASK CASES
        if(this._white.indexOf(ip) == -1) return false
        return true
    },
    isBlack : function(ip){
        var blocked = false;
        _.each(this._black, function(black){
            if(black.ip == ip) blocked = true;
        })
        return blocked;
    },
    addToBlack: function(ip){
        this._black.push({
            "ip": ip,
            "addedOn": new Date().toISOString(),
            "limitBreak":{
                "inDay" : 1, // Daily cron job will reset
                "total" : 1
            }
          })
    },
    increaseLimitBreak : function(ip){
        _.each(this._black, function(black){
            if(black.ip == ip) {
                black.limitBreak.inDay++;
                black.limitBreak.total++;
            } 
        })
    }
  }