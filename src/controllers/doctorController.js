import doctorService from "./../services/doctorService";
import userService from "./../services/userService";
import _ from "lodash";
import moment from "moment";
import multer from "multer";

const MAX_BOOKING = 2;
// hàm chuyển chuỗi ngày tháng thành một đối tượng Date
function stringToDate(dateString, formatString, delimiter = '/') {
    const formatItems = formatString.toLowerCase().split(delimiter);
    const dateItems = dateString.split(delimiter);
    const monthIndex = formatItems.indexOf('mm');
    const dayIndex = formatItems.indexOf('dd');
    const yearIndex = formatItems.indexOf('yyyy');
    const month = parseInt(dateItems[monthIndex], 10) - 1;
    const year = parseInt(dateItems[yearIndex], 10);
    const day = parseInt(dateItems[dayIndex], 10);
    
    return new Date(year, month, day);
  }
  
// hàm lấy lịch làm việc trong 3 ngày của doctor
const getSchedule = async (req, res) => {
    try {
      const threeDaySchedules = Array.from({ length: 3 }, (_, i) =>
        moment().add(i, "days").locale("en").format("DD/MM/YYYY")
      );
  
      const schedules = await doctorService.getDoctorSchedules({
        threeDaySchedules,
        doctorId: req.user.id,
      });
  
      schedules.forEach((x) => {
        x.date = moment(x.date, "DD/MM/YYYY").toDate();
      });
  
      const sortedSchedules = _.sortBy(schedules, "date");
  
      sortedSchedules.forEach((x) => {
        x.date = moment(x.date).format("DD/MM/YYYY");
      });
  
      return res.render("main/users/admins/schedule.ejs", {
        user: req.user,
        schedules: sortedSchedules,
        threeDaySchedules,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
  };
  
// tạo mới lịch khám cho bác sĩ
let getCreateSchedule = (req, res) => {
    return res.render("main/users/admins/createSchedule.ejs", {
        user: req.user
    })
};
// tạo lịch làm việc cho bác sĩ
let postCreateSchedule = async function(req, res) {
    try {
        await doctorService.postCreateSchedule(req.user, req.body.schedule_arr, MAX_BOOKING);
        return res.status(200).json({
            "status": 1,
            "message": 'success'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            "status": 0,
            "message": 'error'
        });
    }
};

//để lấy thông tin lịch làm việc của một bác sĩ theo ngày được chỉ định
let getScheduleDoctorByDate = async (req, res) => {
    try {
        const { doctorId, date } = req.body;
        const object = await doctorService.getScheduleDoctorByDate(doctorId, date);
        const { schedule, doctor } = object;
        return res.status(200).json({
            status: 1,
            message: schedule,
            doctor: doctor
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};


// truy xuất thông tin bác sĩ dựa vào id
let getInfoDoctorById = async (req, res) => {
    try {
        let doctor = await doctorService.getInfoDoctorById(req.body.id);
        return res.status(200).json({
            'message': 'success',
            'doctor': doctor
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};

// hàm dùng để lấy và hiển thị danh sách cuộc hẹn đã được đặt của bác sĩ trong ngày, được sắp xếp theo thời gian và nhóm theo khung giờ
let getManageAppointment = async (req, res) => {
    // Lấy ngày hiện tại
    let currentDate = moment().format('DD/MM/YYYY');
    // Biến kiểm tra ngày hiện tại
    let canActive = false;
    // Biến lưu ngày đặt lịch
    let date = '';
    if (req.query.dateDoctorAppointment) {
        date = req.query.dateDoctorAppointment;
        if (date === currentDate) {
            canActive = true;
        }
    } else {
        // Nếu không có ngày đặt lịch thì lấy ngày hiện tại
        date = currentDate;
        canActive = true;
    }

    // Tạo object data chứa thông tin ngày và id bác sĩ để truy vấn danh sách cuộc hẹn
    let data = {
        date: date,
        doctorId: req.user.id
    };

    // Lấy danh sách cuộc hẹn đã được đặt
    let appointments = await doctorService.getPatientsBookAppointment(data);

    // Sắp xếp danh sách theo thời gian đặt lịch
    let sort = _.sortBy(appointments, x => x.timeBooking);

    // Nhóm danh sách theo khung giờ
    let final = _.groupBy(sort, function(x) {
        return x.timeBooking;
    });

    // Trả về trang hiển thị danh sách cuộc hẹn
    return res.render("main/users/admins/manageAppointment.ejs", {
        user: req.user,
        appointments: final,
        date: date,
        active: canActive
    });
};
//  hàm xử lý route để trả về trang quản lý biểu đồ của bác sĩ.
let getManageChart = (req, res) => {
    return res.render("main/users/admins/manageChartDoctor.ejs", {
        user: req.user
    })
};

// gửi các biểu mẫu cho bệnh nhân thông qua việc xử lý tệp tin được tải lên từ client
let postSendFormsToPatient = (req, res) => {
    FileSendPatient(req, res, async (err) => {
        if (err) {
            console.log(err);
            if (err.message) {
                console.log(err.message);
                return res.status(500).send(err.message);
            } else {
                console.log(err);
                return res.status(500).send(err);
            }
        }
        try {
            const patientId = req.body.patientId;
            const files = req.files;
            let patient = await doctorService.sendFormsForPatient(patientId, files);
            return res.status(200).json({
                status: 1,
                message: 'sent files success',
                patient: patient
            })
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    });
};
// dể lưu trữ các file hình ảnh
let storageFormsSendPatient = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "src/public/images/patients/remedy");
    },
    filename: (req, file, callback) => {
        let imageName = `${Date.now()}-${file.originalname}`;
        callback(null, imageName);
    }
});

// xử lý việc nhận và lưu trữ file gửi đi của bệnh nhân
// let FileSendPatient = multer({
//     storage: storageFormsSendPatient,
//     limits: { fileSize: 1048576 * 20 }
// }).array("filesSend");
const fileUpload = multer({
    storage: storageFormsSendPatient,
    limits: { fileSize: 1048576 * 20 }
  });
  
  let FileSendPatient = (req, res, next) => {
    fileUpload.array("filesSend")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.log(err);
        return res.status(500).json({ message: "File size exceeds the limit" });
      } else if (err) {
        console.log(err);
        return res.status(500).json({ message: "Unknown error occurred" });
      }
      next();
    });
  };
  
// lấy thông tin biểu đồ của bác sĩ dựa trên tháng được yêu cầu
  const postCreateChart = async (req, res) => {
    try {
      const object = await userService.getInfoDoctorChart(req.body.month);
      return res.status(200).json(object);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };
  
  // động tạo lịch hẹn cho tất cả bác sĩ trong hệ thống
  const postAutoCreateAllDoctorsSchedule = async (req, res) => {
    try {
      const data = await userService.createAllDoctorsSchedule();
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };
  
  module.exports = {
    getSchedule,
    getCreateSchedule,
    postCreateSchedule,
    getScheduleDoctorByDate,
    getInfoDoctorById,
    getManageAppointment,
    getManageChart,
    postSendFormsToPatient,
    postCreateChart,
    postAutoCreateAllDoctorsSchedule,
  };
  