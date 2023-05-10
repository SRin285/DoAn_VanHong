import {tranRegisterEmail, tranForgotPassword} from "../../lang/en";
import {sendEmail} from "./../config/mailer";
import userService from "./../services/userService";
require('dotenv').config();

//sử dụng để gửi email cho người dùng
const register = async ({user}, linkVerify) => {
  try {
    const isEmailSend = await sendEmail(user.local.email, tranRegisterEmail.subject, tranRegisterEmail.template(linkVerify));
    if (isEmailSend) {
      return tranRegisterEmail.sendSuccess(user.local.email);
    } else {
      throw new Error(tranRegisterEmail.sendFail);
    }
  } catch (error) {
    throw error;
  }
};
// sử dụng để xác minh tài khoản của người dùng bằng cách xác thực mã thông báo (token) được gửi cho họ qua email.

const verifyAccount = (token) => {
    return new Promise(async (resolve, reject) => {
      try {
        await userService.verifyAccount(token);
        resolve(tranRegisterEmail.account_active);
      } catch (error) {
        reject(error);
      }
    });
  };
  
// để gửi email reset password cho người dùng.
const resetPassword = async (email, linkVerify) => {
    try {
      const isEmailSend = await sendEmail(email, tranForgotPassword.subject, tranForgotPassword.template(linkVerify));
      return isEmailSend ? true : false;
    } catch (error) {
      return false;
    }
  };

//  sử dụng để thiết lập mật khẩu mới cho người dùng có email được truyền vào

const setNewPassword = async (email, password) => {
    try {
      const user = await userService.findUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
      await userService.setNewPassword(user._id, password);
      return true;
    } catch (err) {
      throw err;
    }
  };
  
  module.exports = {
    register,
    verifyAccount,
    resetPassword,
    setNewPassword
  };
  