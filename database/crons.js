const cron = require('node-cron');
const moment = require('moment');
// hora server: 22:49:00 - hora local: 17:49
// cron.schedule('* * * * *', function() {
//     console.log('running a task every minute');
//     console.log(moment().format('HH:mm:ss'))
//   });

cron.schedule('17 17 * * *', function() {
    console.log('---------------------');
   console.log("ejecutando cronn2")
  });