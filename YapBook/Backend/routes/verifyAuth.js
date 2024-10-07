const passport = require('passport');

//single function to differentiate users from guests; avoids redundancy

const differentiateUserOrGuest = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, userOrGuest, info) => {
        if (err) return next(err);
        if (userOrGuest) {
            if (userOrGuest.guestId) {
                req.guestId = userOrGuest.guestId; // assign guestId to the request object
                return next();
            } else {
                req.user = userOrGuest; // assign user to the request object
                return next();
            }
        } else {
            return res.status(401).json({ message: info.message || 'Unauthorized' });
        }
    })(req, res, next);
};

module.exports = differentiateUserOrGuest;

