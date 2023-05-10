//để xác thực quyền truy cập vào các trang chỉ dành cho quản trị viên (ADMIN)
export default function requireAdmin(req, res, next) {
    if (req.session.role === "ADMIN") {
      next();
    } else {
      res.redirect("/login");
    }
  };