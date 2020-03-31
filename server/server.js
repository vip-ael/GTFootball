const express = require('express');
const cors = require('cors');
const webpush = require("web-push");

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({
        msg: 'GT Football server is responsive'
    })
});

app.post('/push', (req, res) => {
    // const {endpoint, p256dh, auth} = req.body; 
    // const pushSubscription = {
    //   endpoint,
    //   keys: {
    //     p256dh,
    //     auth
    //   }
    // };

    // webpush.sendNotification(pushSubscription, "Your Push Payload Text");
    // res.json({msg: 'sent push!'});
    console.log(req.body);
    res.json(req.body); 
}); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`GT Football server running on port ${PORT}`));
