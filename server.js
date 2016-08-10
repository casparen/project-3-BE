const PORT = process.env.PORT || 3333;
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const format = require('date-format');
const twilio = require('twilio');
const cronJob = require('cron').CronJob;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_NUMBER = process.env.TWILIO_NUMBER
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const app = express();

// const firebase = require('firebase');
// usersRef = new Firebase('{FIREBASEURL}/Users');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

const userArr = [
    {Fname: "Harry", mNumber: "+19175172934", dob:"1203"},
    {Fname: "Al", mNumber: "+12017804856", dob: "0812"},
    {Fname: "Mimi", mNumber: "+9175763311", dob: "0811"},
    {Fname: "Casper", mNumber: "+6318006170", dob: "1103"}
];

// app.get('/', (req, res) => {
//     numbers.map(each => {
//         client.sendMessage({
//             to: each,
//             from: '##',
//             body: `BIRTHDAY REMINDER: xxx's birthday is tomorrow!`
//         }, (err, data) => console.log(data.body))
//     });
// });

////////////////////////////////////////////////////////////Sending Reminder Message 1 day ahead
//using the test number at the moment
var job = new cronJob('15 40 14 * * *', function (useArr) {
    const arr1 = userArr.filter(each => each.dob === format('MM', new Date()) + (parseInt(format('dd', new Date()), 10) + 1));
    console.log(arr1);

    if (arr1.length > 0) {
      // const arr2 = userArr.map(each => each.mNumber);
      const arr2 = userArr.filter(each => each.dob !== format('MM', new Date()) + (parseInt(format('dd', new Date()), 10) + 1)).map(each => each.mNumber);
      console.log(arr2);

      arr2.map(each => {
        console.log(arr1[0].Fname);
        client.sms.messages.create({
          to: each,
          from: "+15005550006",
          body: `BIRTHDAY REMINDER: Tomorrow is ${arr1[0].Fname}'s birthday!'`
        }, (err, data) => console.log(data) )
      })

    }
    // console.log(arr1);


    // for (let i = 0; i < userArr.length; i++) {
    //     if (userArr[i].dob == format('MM', new Date()) + (parseInt(format('dd', new Date()), 10) + 1)) {
    //         console.log(userArr[i].Fname)
    //     }
    // }
});
job.start();

// app.get('/hello', function(req, res) {
//     console.log("incoming get req");
//     return job;
// });

app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
    console.log('RIGHT NOW: ', format(new Date()));
    console.log('TIME TOMMOROW:', format('MM', new Date()) + (parseInt(format('dd', new Date()), 10) + 1));
});
