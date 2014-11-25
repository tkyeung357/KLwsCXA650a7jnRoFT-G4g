var fivebeans = require('fivebeans'),
beanworker = require('fivebeans').worker;


//variables
var host = 'challenge.aftership.net', 
port = 11300,
tube_name = 'tkyeung357',
tube_list = ['tkyeung357'];

var job = { 
    type: 'tkyeung357', 
    payload: {
        from: "HKD",
        to: "USD"
    }
};

/*
 *  client
 */

var client = new fivebeans.client('challenge.aftership.net', 11300);
client
.on('connect', function() {
    // client can now be used
    console.log('connected');
    
    client.use(tube_name, function(err, tubename) {
        console.log('using ' + tubename);
        //put job to tube 
        client.put(0, 0, 60, JSON.stringify([tubename, job]), function(err, jobid) {
            console.log('queued a job in ' + tubename + ' : id = ' + jobid);
        });
    });
    //console.log(client);
})
.on('error', function(err) {
    // connection failure    
    console.log('connect fail');
    console.log(err);
})
.on('close', function() {
    // underlying connection has closed
    console.log('connect closed');
})
.connect();

/*
 *   worker
 */
 
//options
var counter = 1;
var options = {
    id: 'worker_tkyeung357',
    host: host,
    port: port,
    handlers: {
        tkyeung357: require('./xe_rate_handler')()
    },
    igonreDefault: true
}

var worker = new beanworker(options);
worker
.on('started', function() {
    console.log('worker started');
})
.on('error', function(data) {
   console.log('worker error'); 
   console.log(data);
})
.on('info', function(data) {
   console.log('worker info'); 
   console.log(data);
})
.on('warning', function(data) {
   console.log('worker warning'); 
   console.log(data);
})
.on('stopped', function(data) {
   console.log('worker stopped'); 
})
.on('job.reserved', function(data) {
    console.log('job.reserved');
    console.log(data);
})
.on('job.deleted', function(data) {
    console.log('job.deleted');
    console.log(data);
})
.on('job.handled', function(data) {
    console.log('job.handled');
    console.log(data);
    if(counter === 3){
        console.log('job handled 10 times, worker stop now');
        console.log(data.id);
        worker.stop();
        return;
    }
    
    if(data.action === 'success') {
        // success, reput job to tube and delay 60s
        client.put(0, 60, 60, JSON.stringify([tube_name, job]), function(err, jobid) {
            console.log('re-put a job in ' + tube_name + ' : id = ' + jobid);
        });
    }
    
    console.log('job handled counter = ' + counter);
    counter++;
})
.start(tube_list);