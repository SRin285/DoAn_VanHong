import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import userService from './../../services/userService';

// xác thực người dùng bằng cách yêu cầu họ nhập email và mật khẩu
const initPassportLocal = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          const user = await userService.findUserByEmail(email);
          if (!user) {
            return done(null, false, { message: 'Email không tồn tại!' });
          }

          const passwordMatches = await userService.comparePassword(password, user);
          if (!passwordMatches) {
            return done(null, false, { message: 'Mật khẩu không đúng!' });
          }

          return done(null, user, null);
        } catch (error) {
          console.log(error);
          return done(null, false, { message: error });
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userService.findUserById(id);
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  });
};

export default { initPassportLocal };
