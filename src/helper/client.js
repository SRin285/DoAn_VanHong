import db from "./../models";
import moment from "moment";

const getSpecializationById = async (id) => {
    try {
        const specialization = await db.Specialization.findOne({ where: { id: id } });
        return specialization;
    } catch (e) {
        throw e;
    }
};

const getClinicById = async (id) => {
    try {
        const clinic = await db.Clinic.findOne({ where: { id: id } });
        return clinic;
    } catch (e) {
        throw e;
    }
};

const getSupporterById = async (id) => {
    try {
        const user = await db.User.findOne({
            where: { id: id },
            attributes: [ 'id', 'name', 'avatar' ]
        });
        return user;
    } catch (e) {
        throw e;
    }
};

const convertDateClient = (date) => moment(date).format('DD-MM-YYYY');

export default {
    getSpecializationById,
    getClinicById,
    getSupporterById,
    convertDateClient
};
