const sys = require('../../frankify');
const User = require('../../models/user')


exports.auth =  (req, res) => {
 //find the user
 User.findOne({name: req.body.name},(err, user) => {
    if (err) throw err;

    if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

        // check if password matches
        if (user.password != req.body.password) {

            res.json({ success: false, message: 'Authentication failed. Wrong password.' });

        } else {
            // return the information including token as JSON
            res.json({
                success: true,
                message: 'Enjoy your token!',
                token: sys.createTokens(user)
            });
        }
    }
 });
};