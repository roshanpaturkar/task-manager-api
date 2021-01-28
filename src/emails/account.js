const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'paturkarr@gmail.com',
        subject: 'Thanks for joining!',
        text: `Hello ${name}! \nWelcome to the Task Manager App, We are happy to manage your tasks for you and keep you up to date!`
    })
}

const sendGoodByeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'paturkarr@gmail.com',
        subject: `Good Bye, ${name}!`,
        text: `Bye ${name}! \nIt's very to tough to say good bye to you. Hope we will meet soon. \nWe are deleting your private data from our server for your safety. Have great life ahead!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodByeEmail
}