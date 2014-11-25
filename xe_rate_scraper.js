var request = require('request');
var cheerio = require('cheerio');
var util = require("util");

module.exports = {
    getRate: function(payload, callback){
        var from = payload.from || '';
        var to = payload.to || '';
        console.log('payload = ' + JSON.stringify(payload));
        
        var result = {
            "from": "",
            "to": "",
            "created_at": null,
            "rate": "0.00"
        },
        status = false;
        
        //check parameter
        if(!from || !to) {
            callback(status, result);
        }
        
        //concate url
        var url = util.format("http://www.xe.com/currencyconverter/convert/?Amount=1&From=%s&To=%s", from, to); 
        console.log('xe_url = ' + url);
        
        request(url, function(error, response, html){
            if(!error && response.statusCode == 200){
                var $ = cheerio.load(html);
                var element = $('table.ucc-result-table tr.uccRes>td');
                var rate = parseFloat(element.eq(2).text()).toFixed(2);
                console.log('xe_rate = ' + rate);
                if(!isNaN(rate)) {
                    status = true;
                    result.rate = rate;
                    result.created_at = new Date();
                    result.from = from;
                    result.to = to;
                }
                
            }
                callback(status, result);
        });
        
    }
};