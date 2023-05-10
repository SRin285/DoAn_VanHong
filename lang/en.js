// để lưu trữ các thông báo lỗi cho việc xác thực dữ liệu
export const transValidation = {
    email_incorrect: "Invalid email",
    gender_incorrect: "Invalid gender",
    password_incorrect: "Password must have at least 6 characters",
    password_confirmation_incorrect: "The confirm password is not correct",
};
// thông báo đến người dùng khi họ đã đặt lịch khám bệnh tại hệ thống Doctors Care
export const transMailBookingNew = {
    subject: "Thông báo email về tiến trình đặt lịch khám bệnh tại Doctors Care",
    template: (data) => {
        return `<h3>Cảm ơn bạn đã đặt lịch khám bệnh tại hệ thống Doctors Care </h3>
        <h4>Thông tin về cuộc hẹn đã đặt:</h4>
        <div>Doctor's name: ${data.doctor} </div>
        <div>Time: ${data.time}</div>
        <div>Date: ${data.date}</div>
        <div>Status: <b> Pending - Một cuộc hẹn mới đang chờ xác nhận</b></div>
        <h4>Hệ thống Doctors Care sẽ tự động gửi thông báo email khi cuộc hẹn được xác nhận thành công. Cảm ơn bạn!</h4>`;
    },
};
// thông báo khi việc đặt lịch khám bệnh không thành công   
export const transMailBookingFailed = {
    subject: "Thông báo email về tiến trình đặt lịch khám bệnh tại Doctors Care",
    template: (data) => {
        return `<h3> Cảm ơn bạn đã đặt lịch khám bệnh tại hệ thống Doctors Care  </h3>
        <h4>Thông tin về cuộc hẹn đã đặt:</h4>
        <div>Doctor's name: ${data.doctor} </div>
        <div>Time: ${data.time}</div>
        <div>Date: ${data.date}</div>
        <div>Status: <b>Cancel - ${data.reason}</b></div>
        <h4>Nếu bạn phát hiện lỗi trong email này, vui lòng liên hệ với nhân viên hỗ trợ: <b>0000000</b>. Cảm ơn bạn!</h4>`;
    },
};
// thông báo khi việc đặt lịch khám bệnh thành công
export const transMailBookingSuccess = {
    subject: "Thông báo email về tiến trình đặt lịch khám bệnh tại Doctors Care",
    template: (data) => {
        return `<h3>Cảm ơn bạn đã đặt lịch khám bệnh tại hệ thống Doctors Care </h3>
        <h4>Thông tin về cuộc hẹn đã đặt:</h4>
        <div>Doctor's name: ${data.doctor} </div>
        <div>Time: ${data.time}</div>
        <div>Date: ${data.date}</div>
        <div>Status: <b>Succeed</b></div>
        <h4>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</h4>`;
    },
};
// thông báo cho khách hàng sau khi họ đã đặt lịch khám bệnh và đã được bác sĩ kê toa thuốc
export const transMailRemedy= {
    subject: "Email gửi hóa đơn y tế từ bác sĩ",
    template: (data) => {
        return `<h3>Cảm ơn bạn đã tin tưởng đặt lịch khám bệnh trong hệ thống DoctorCare</h3>
        Sau khi bạn đã thăm khám bác sĩ<b> ${data.doctor} </b>, Bạn có thể xem lại chi tiết hóa đơn từ tệp đính kèm trong email này </h4>
        <div>Mật khẩu để giải nén tệp đính kèm có dạng sau: <i>Họ tên đầy đủ không dấu - 3 chữ số đầu tiên của số điện thoại - 2 chữ số cuối năm sinh của bạn</div>
        <br>
        <div>Ví dụ: Với họ tên đầy đủ là 'vanhong', số điện thoại đăng ký là '0123456789' và năm sinh là '1910', mật khẩu giải nén sẽ là:". <b> vanhong-01-10</b> </div>
        <br>
        <div>Nếu bạn không nhận được tệp đính kèm hoặc không thể giải nén, vui lòng liên hệ với nhân viên hỗ trợ<b>000 000</b></div>
        <h4>cám ơn đã dùng dịch vụ!</h4>`;
    },
};
