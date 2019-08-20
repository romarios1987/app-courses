const keys = require('../keys');

module.exports = function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Registration success! Account was created',
        html: `
            <h1>Welcome to our Courses app!</h1>
            <p>You success created account with email -  ${email}</p>
            <hr>
            <a href="${keys.BASE_URL}" target="_blank">Courses App</a>
        `
    }
};