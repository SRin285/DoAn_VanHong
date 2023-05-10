/*  để kiểm tra xem người dùng đã đăng nhập hay chưa bằng cách xác thực token */
import jwt from "jsonwebtoken";

const checkToken = (req, res, next) => {
const token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
if (!token) {
return res.status(401).json({
success: false,
message: 'Auth token is required'
});
}
if (token.startsWith('Bearer ')) {
// Remove Bearer from string
token = token.slice(7, token.length);
}
if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid (expired or something), try to get a new one'
            });
        } else {
            req.decoded = decoded;
            next();
        }
    });
} else {
    return res.status(401).json({
        success: false,
        message: 'Auth token is not supplied'
    });
}
};

export default checkToken;