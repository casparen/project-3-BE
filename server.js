const PORT = process.env.PORT || 3333;
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const format = require('date-format');
const twilio = require('twilio');
const cronJob = require('cron').CronJob;
const firebase = require('firebase');
const _ = require('lodash');
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_NUMBER = process.env.TWILIO_NUMBER;
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const app = express();

// firebase config
firebase.initializeApp({
    databaseURL: "https://happybday-d595a.firebaseio.com",
});
const db = firebase.database();
const ref = db.ref("/ga/wdi/robots/users");
ref.once("value", function(snapshot) {
    console.log(snapshot.val());
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

// POST: SEND GREETING TO BIRTHDAY USER
app.post('/message', (req, res) => {
    console.log("incoming post request at /message");
    console.log("SID: ", TWILIO_ACCOUNT_SID, "TOKEN: ", TWILIO_AUTH_TOKEN);
    console.log("REQ.BODY", req.body);
    const obj = req.body;
    const message = `[GA birthday] ${obj.message} from -${obj.sender.toUpperCase()}-`;
    console.log("obj: ", obj);
    console.log("message: ", message);
    client.messages.create({
        to: obj.phone,
        from: TWILIO_NUMBER,
        body: message,
        mediaUrl: obj.giphyUrl
    }, (err, data) => {
        console.log("error: ", err);
        console.log(data);
    })
});

// SENDING REMINDER SMS 1 DAY AHEAD
var job = new cronJob('00 15 10 * * *', function () {
    ref.on("value", function(snapshot) {
        // console.log(snapshot.val());
        const userArr = _.values(snapshot.val());
        //birthday kid
        const bDayUser = userArr.filter(each => each.dob === format('MM', new Date()) + (parseInt(format('dd', new Date()), 10) + 1));
        console.log(bDayUser);
        if (bDayUser.length > 0) {
            const targetUser = userArr.filter(each => each.dob !== format('MM', new Date()) + (parseInt(format('dd', new Date()), 10) + 1)).map(each => each.phone);
            console.log(targetUser);
            targetUser.map(each => {
                console.log(bDayUser[0].name);
                client.sms.messages.create({
                    to: each,
                    from: TWILIO_NUMBER,
                    body: `[GA B-DAY REMINDER] Tomorrow is ${bDayUser[0].name}'s birthday!'`
                }, (err, data) => console.log(data))
            })
        }
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});
// job.start();

app.listen(PORT, () => {
    console.log(`server listening on ${PORT}`);
    console.log('RIGHT NOW: ', format(new Date()));
    console.log('TIME TOMMOROW:', format('MM', new Date()) + (parseInt(format('dd', new Date()), 10) + 1));
});
