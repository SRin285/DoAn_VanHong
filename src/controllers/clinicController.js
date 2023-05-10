//  để lấy thông tin của một phòng khám theo ID và trả về dưới dạng JSON thông qua API
import clinicService from "../services/clinicService";
const getInfoClinicById = async (req, res) => {
    try {
        const { id } = req.body;
        const clinic = await clinicService.getClinicById(id);
        return res.status(200).json({
            message: 'Get clinic info successful',
            clinic
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Error getting clinic information'
        });
    }
};


module.exports = {
    getInfoClinicById
}