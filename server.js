const PORT = process.env.PORT || 3333;
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const format = require('date-format');
const twilio = require('twilio');
const cronJob = require('cron').CronJob;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const app = express();

// const firebase = require('firebase');
// usersRef = new Firebase('{FIREBASEURL}/Users');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

const userArr = [
    {Fname: "Harry", mNumber: "+19175172934", dob:"1203"},
    {Fname: "Al", mNumber: "+12017804856", dob: "0811"},
    {Fname: "Mimi", mNumber: "+9175763311", dob: "0911"},
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

////////////////////////////////////////////////////////////birthday kid
var job = new cronJob('* * * * * *', function (useArr) {
    let arr1 = userArr.filter(each => each.dob === format('MM', new Date()) + (parseInt(format('dd', new Date()), 10) + 1));
    console.log(arr1);

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
    console.log('TIME:', format('MM', new Date()) + (parseInt(format('dd', new Date()), 10) + 1));
});
