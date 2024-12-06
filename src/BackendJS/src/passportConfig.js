const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcrypt');
const prisma = require('./prisma/client');
const passport = require('passport');

// here i chose to use JWT instead of session as i could not make sessions persist,
// regardless of the expiration time i set on them. tokens were easier to use for this app

passport.use(new LocalStrategy({
    usernameField: 'username',
}, async (username, password, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            return done(null, false, { message: 'Incorrect username' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        if (jwt_payload.guestId) {
            return done(null, { guestId: jwt_payload.guestId });
        }
        
        if (jwt_payload.id) {
            const blacklistedToken = await prisma.token.findUnique({ where: { token: jwt_payload.jti } });
            if (blacklistedToken) {
                return done(null, false, { message: 'Token blacklisted' });
            }
            
            const user = await prisma.user.findUnique({ where: { id: jwt_payload.id } });
            if (user) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'User not found' });
            }
        }
        
        return done(null, false, { message: 'Invalid token' });
    } catch (err) {
        return done(err, false);
    }
}));

module.exports = passport;