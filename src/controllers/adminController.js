import homeService from "./../services/homeService";
import userService from "./../services/userService";
import clinicService from "./../services/clinicService";
import specializationService from "./../services/specializationService";
import supporterService from "./../services/supporterService";
import doctorService from "./../services/doctorService";
import multer from "multer";

// lấy thông tin bác sĩ 
const getManageDoctor = async (req, res) => {
  const doctors = await userService.getInfoDoctors();
  res.render("main/users/admins/manageDoctor.ejs", { user: req.user, doctors });
};
// lấy thông tin phòng khám
const getManageClinic = async (req, res) => {
  const clinics = await homeService.getClinics();
  res.render("main/users/admins/manageClinic.ejs", { user: req.user, clinics });
};
// lấy thông tin về danh sách các phòng khám và chuyên khoa
const getCreateDoctor = async (req, res) => {
  const [clinics, specializations] = await Promise.all([
    homeService.getClinics(),
    homeService.getSpecializations(),
  ]);
  res.render("main/users/admins/createDoctor.ejs", { user: req.user, clinics, specializations });
};
 // thêm bác sĩ 
const postCreateDoctor = async (req, res) => {
  const doctor = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
    clinicId: req.body.clinic,
    specializationId: req.body.specialization,
    address: req.body.address,
    avatar: "doctor.jpg",
    description: req.body.description,
  };
  try {
    await userService.createDoctor(doctor);
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};
// lấy ds phòng khám
const getCreateClinic = (req, res) => {
  res.render("main/users/admins/createClinic.ejs", {
    user: req.user,
  });
};
// thêm phòng khám
const postCreateClinic = async (req, res) => {
  try {
    const item = req.body;
    const imageClinic = req.file;
    item.image = imageClinic.filename;
    const clinic = await clinicService.createNewClinic(item);
    res.status(200).json({ message: "success", clinic });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};
// xử lí file upload
const storageImageClinic = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/public/images/clinics");
  },
  filename: (req, file, callback) => {
    const imageName = `${Date.now()}-${file.originalname}`;
    callback(null, imageName);
  },
});
// multer để upload một file ảnh về server
const imageClinicUploadFile = multer({
  storage: storageImageClinic,
  limits: { fileSize: 1048576 * 20 },
}).single("image");
// thêm phòng khám
const postCreateClinicWithoutFile = async (req, res) => {
  try {
    const clinic = await clinicService.createNewClinic(req.body);
    res.status(200).json({ message: "success", clinic });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

// xóa phòng khám
const deleteClinicById = async (req, res) => {
  try {
    const clinicId = req.body.id;
    await clinicService.deleteClinicById(clinicId);
    res.status(200).json({
      message: "success",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

// lấy thông tin phòng khám bác sĩ để sữa
const getEditClinic = async (req, res) => {
  try {
    const clinic = await clinicService.getClinicById(req.params.id);
    res.render("main/users/admins/editClinic.ejs", { user: req.user, clinic });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};
// cập nhật thông tin phòng 
const putUpdateClinicWithoutFile = async (req, res) => {
  try {
    const clinicId = req.params.id;
    const updatedClinic = req.body;
    
    const clinic = await clinicService.updateClinicById(clinicId, updatedClinic);
    
    return res.status(200).json({
      message: "Update clinic success",
      clinic: clinic,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error });
  }
};
// để cập nhật thông tin của một phòng khám trong hệ thống
let putUpdateClinic = (req, res) => {
  imageClinicUploadFile(req, res, async (err) => {
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
      let item = req.body;
      let imageClinic = req.file;
      item.image = imageClinic.filename;
      let clinic = await clinicService.updateClinic(item);
      return res.status(200).json({
        message: "update clinic successful",
        clinic: clinic,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send(e);
    }
  });
};

//  lấy danh sách tất cả các chuyên khoa 
const getSpecializationPage = async (req, res) => {
  try {
    const specializations = await specializationService.getAllSpecializations();
    res.render("main/users/admins/manageSpecialization.ejs", {
      user: req.user,
      specializations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
//xóa bác sĩ dựa trên ID
let deleteDoctorById = async (req, res) => {
  try {
    let doctor = await doctorService.deleteDoctorById(req.body.id);
    return res.status(200).json({
      message: "success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// thông tin của bác sĩ dựa trên id
let getEditDoctor = async (req, res) => {
  try {
    const doctor = await doctorService.getDoctorForEditPage(req.params.id);
    const clinics = await homeService.getClinics();
    const specializations = await homeService.getSpecializations();
    res.render("main/users/admins/editDoctor.ejs", {
      user: req.user,
      doctor,
      clinics,
      specializations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// nhật thông tin của bác sĩ trong cơ sở dữ liệu thông qua gọi đến hàm updateDoctorInfo của đối tượng doctorService
let putUpdateDoctorWithoutFile = async (req, res) => {
  try {
    let item = {
      id: req.body.id,
      name: req.body.nameDoctor,
      phone: req.body.phoneDoctor,
      address: req.body.addressDoctor,
      description: req.body.introEditDoctor,
      clinicId: req.body.clinicDoctor,
      specializationId: req.body.specializationDoctor,
    };
    await doctorService.updateDoctorInfo(item);
    return res.status(200).json({
      message: "update info doctor successful",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

// cập nhật thông tin bác sĩ và ảnh đại diện của bác sĩ trong cơ sở dữ liệu
let putUpdateDoctor = (req, res) => {
  imageDoctorUploadFile(req, res, async (err) => {
    if (err) {
      if (err.message) {
        return res.status(500).send(err.message);
      } else {
        return res.status(500).send(err);
      }
    }

    try {
      let item = {
        id: req.body.id,
        name: req.body.nameDoctor,
        phone: req.body.phoneDoctor,
        address: req.body.addressDoctor,
        description: req.body.introEditDoctor,
        clinicId: req.body.clinicDoctor,
        specializationId: req.body.specializationDoctor,
      };
      let imageDoctor = req.file;
      item.avatar = imageDoctor.filename;
      let doctor = await doctorService.updateDoctorInfo(item);
      return res.status(200).json({
        message: "update doctor info successful",
        doctor: doctor,
      });
    } catch (e) {
      return res.status(500).send(e);
    }
  });
};
// khởi tạo cấu hình lưu trữ (storage configuration) cho việc upload file ảnh của bác sĩ.
let storageImageDoctor = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "src/public/images/users");
  },
  filename: (req, file, callback) => {
    let imageName = `${Date.now()}-${file.originalname}`;
    callback(null, imageName);
  },
});
// middleware được sử dụng để xử lý việc upload file ảnh của bác sĩ lên server
let imageDoctorUploadFile = multer({
  storage: storageImageDoctor,
  limits: { fileSize: 1048576 * 20 },
}).single("avatar");

// hiển thị trang quản lý nhân viên 
let getSupporterPage = async (req, res) => {
  let supporters = await supporterService.getAllSupporters();
  return res.render("main/users/admins/manageSupporter.ejs", {
    user: req.user,
    supporters: supporters,
  });
};

//xóa một chuyên khoa bác sĩ khỏi cơ sở dữ liệu
let deleteSpecializationById = async (req, res) => {
  try {
    await specializationService.deleteSpecializationById(req.body.id);
    return res.status(200).json({
      message: "delete specialization successful",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

let getManageBotPage = async (req, res) => {
  try {
    return res.send("RES.");
  } catch (e) {
    console.log(e);
  }
};
// xóa bài post dl vào id
let deletePostById = async (req, res) => {
  try {
    await supporterService.deletePostById(req.body.id);
    return res.status(200).json({
      message: "delete post successful",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

// dùng để xóa một supporter (người hỗ trợ) thông qua id của supporter
const deleteSupporterById = async (req , res) =>{
  try {
    await supporterService.deleteSupporterById(req.body.id);
    return res.status(200).json({
      message: "delete post successful",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
}
// để truy xuất trang chỉnh sửa bài viết
let getEditPost = async (req, res) => {
  try {
    let clinics = await homeService.getClinics();
    let doctors = await userService.getInfoDoctors();
    let specializations = await homeService.getSpecializations();
    let post = await supporterService.getDetailPostPage(req.params.id);
    return res.render("main/users/admins/editPost.ejs", {
      clinics: clinics,
      doctors: doctors,
      specializations: specializations,
      user: req.user,
      post: post,
    });
  } catch (e) {
    console.log(e);
  }
};

// dùng để cập nhật thông tin bài viết
let putUpdatePost = async (req, res) => {
  try {
    let data = {
      id: req.body.id,
      title: req.body.titlePost,
      forDoctorId: req.body.forDoctorId,
      forClinicId: req.body.forClinicId,
      forSpecializationId: req.body.forSpecializationId,
      writerId: req.user.id,
      contentMarkdown: req.body.contentMarkdown,
      contentHTML: req.body.contentHTML,
      updatedAt: Date.now(),
    };

    await supporterService.putUpdatePost(data);
    return res.status(200).json({
      message: "update post successful",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
  }
};

// sử dụng để trả về trang quản lý lịch khám bệnh của bác sĩ cho trang web
let getManageCreateScheduleForDoctorsPage = async (req, res) => {
  try {
    return res.render("main/users/admins/manageScheduleForDoctors.ejs", {
      user: req.user,
    });
  } catch (e) {
    console.log(e);
  }
};

//  lấy thông tin thống kê dữ liệu về số lượng đăng ký tài khoản và số lượng bài viết được đăng trong một tháng 
const getInfoStatistical = async (req, res) => {
  try {
    const { month } = req.body;
    const object = await userService.getInfoStatistical(month);
    return res.status(200).json(object);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  getManageDoctor,
  getCreateDoctor,
  getEditClinic,
  getManageClinic,
  getCreateClinic,
  getSpecializationPage,
  getEditDoctor,
  getSupporterPage,
  getManageBotPage,
  getEditPost,
  getManageCreateScheduleForDoctorsPage,
  getInfoStatistical,

  postCreateDoctor,
  postCreateClinic,
  postCreateClinicWithoutFile,

  putUpdateClinicWithoutFile,
  putUpdateClinic,
  putUpdateDoctorWithoutFile,
  putUpdateDoctor,
  putUpdatePost,

  deleteClinicById,
  deleteDoctorById,
  deleteSpecializationById,
  deletePostById,
  deleteSupporterById
};
