var xe_scraper = require("./xe_rate_scraper"),
xe_db = require("./xe_rate_db");

module.exports = function() {
    function xe_rate_handler() {
        this.type = 'tkyeung357';
    }
    xe_rate_handler.prototype.work = function(payload, callback) {
        
        // tkyeung357 handler
        xe_scraper.getRate(payload, function(status, data) {
            console.log('scrapping status = ' + status);
            if(!status) {
                console.log('scrapping failed');
                // reput job tube and delay 3s
                callback('release', 3);
                return;
            }
            console.log('scrapping result = ' + JSON.stringify(data));
            var xe_rate = new xe_db();
            xe_rate.insertXeRate(data, function(err, result) {
                if(err !== null) {
                    console.log('insert failed');
                    console.log(err);
                    // reput job to tube and delay 3s
                    callback('release', 3);
                    return;
                }
                console.log('data insert to xerate collection');
                // success, reput job to tube and delay 60s
                callback('success');
                return;
            });
        });
    }
    
    var handler = new xe_rate_handler();
    return handler;
};