const { validationResult } = require("express-validator");
const authService = require("../services/authService");

const getLogin = (req, res) => {
    res.render("auth/login.ejs", {
        error: req.flash("error"),
    });
};

const getRegister = (req, res) => {
    res.render("auth/register.ejs");
};

// xử lý thông tin đăng ký tài khoản sau khi họ đã điền thông tin vào form đăng ký.
const postRegister = async (req, res) => {
    const errors = validationResult(req).array({
        onlyFirstError: true,
    });

    if (errors.length) {
        let errEmail = "", errPassword = "", errPasswordConfirm = "";
        errors.forEach((err) => {
            if (err.param === "rg_email") errEmail = err.msg;
            if (err.param === "rg_password") errPassword = err.msg;
            if (err.param === "rg_password_again") errPasswordConfirm = err.msg;
        });
        return res.render("auth/register", {
            errEmail: errEmail,
            errPassword: errPassword,
            errPasswordConfirm: errPasswordConfirm,
            hasErrors: errors,
            oldData: req.body,
        });
    }

    try {
        const user = await authService.register(
            req.body.name,
            req.body.rg_email,
            req.body.rg_password,
            req.protocol,
            req.get("host")
        );

        const linkVerify = `${req.protocol}://${req.get(
            "host"
        )}/verify/${user.local.verifyToken}`;

        await authService
            .register({ user }, linkVerify)
            .then((message) => {
                req.flash("success", message);
                res.redirect("/login");
            })
            .catch((err) => {
                console.log(err);
            });
    } catch (err) {
        req.flash("errors", err);
        res.render("/register", {
            oldData: req.body,
        });
    }
};
// xác thực tài khoản của người dùng bằng cách xác minh mã thông báo (token) được truyền trong yêu cầu
const verifyAccount = async (req, res) => {
    try {
        const verifySuccess = await auth.verifyAccount(req.params.token);
        const successArr = [verifySuccess];
        req.flash("success", successArr);
        res.redirect("/login");
    } catch (error) {
        console.log(error);
    }
};

const getLogout = (req, res) => {
    req.session.destroy(function (err) {
        console.log(err);
        res.redirect("/login");
    });
};

const checkLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    next();
};

const checkLoggedOut = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/users");
    }
    next();
};

module.exports = {
    getLogin,
    getRegister,
    postRegister,
    verifyAccount,
    getLogout,
    checkLoggedIn,
    checkLoggedOut,
};
