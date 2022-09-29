const axios = require('axios');

const url = process.env.EMAIL_GATEWAY
const hostId = process.env.EMAIL_HOST_ID

const sendMail = (data) => {
    const config = {
        method: 'post',
        url: url,
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
}

const sendWelcomeEmail = (email, name) => {
    const data = JSON.stringify({
        host_id: hostId,
        name: 'Omnimemor',
        to: [
            email
        ],
        subject: `Welcome to the app, ${name}!`,
        body: `Welcome to the app, ${name}! \nLet me know how you get along with the app. \n\nBest regards, \nOmnimemor Team`
    });
    
    sendMail(data);
}

const sendGoodByeEmail = (email, name) => {
    const data = JSON.stringify({
        host_id: hostId,
        name: 'Omnimemor',
        to: [
            email
        ],
        subject: `Sorry to see you go ${name}!`,
        body: `Hello ${name}! \nWe are sorry to see you go, please let us know what we can do to improve our service! \nWe are deleting your private data from our server for your safety. \nThank you for using our service! \n\nBest regards, \nOmnimemor Team`
    });
    
    sendMail(data);
}

module.exports = {
    sendWelcomeEmail,
    sendGoodByeEmail
}