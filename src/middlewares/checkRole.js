// import {ROLES} from "../utils/roles";

// const getRedirectUrl = (role) => {
//     switch (role) {
//         case ROLES.Admin:
//             return '/admin-dashboard';
//         case ROLES.Customer:
//             return '/customer-dashboard';
//         default:
//             return '/';
//     }
// };

// const checkRole = (req, res, next) => {
//     if (!req.user.role) {
//         return res.redirect('/login')
//     }
//     switch (req.user) {
//         case Ro

//     }

//     getRedirectUrl(req.user.local.role);
//     return next()
// };
// export {getRedirectUrl}
import { ROLES } from "../utils/roles";

const getRedirectUrl = (role) => {
  switch (role) {
    case ROLES.Admin:
      return "/admin-dashboard";
    case ROLES.Customer:
      return "/customer-dashboard";
    default:
      return "/";
  }
};

const checkRole = (req, res, next) => {
  if (!req.user.role) {
    return res.redirect("/login");
  }

  const redirectUrl = getRedirectUrl(req.user.role);

  if (redirectUrl !== "/") {
    return res.redirect(redirectUrl);
  }

  return next();
};

export { getRedirectUrl, checkRole };