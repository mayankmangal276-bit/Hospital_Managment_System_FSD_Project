import express from "express"
import { deleteAppointment, getAllAppointments, getDoctorAppointments, postAppointment, updateAppointmentStatus, updateDoctorAppointmentStatus } from "../controller/appointmentController.js";
import { isAdminAuthenticated, isDoctorAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();


router.post("/post",isPatientAuthenticated, postAppointment)
router.get("/getall",isAdminAuthenticated, getAllAppointments)
router.put("/update/:id",isAdminAuthenticated, updateAppointmentStatus)
router.delete("/delete/:id",isAdminAuthenticated, deleteAppointment)
router.get("/doctor/getall", isDoctorAuthenticated, getDoctorAppointments)
router.put("/doctor/update/:id", isDoctorAuthenticated, updateDoctorAppointmentStatus)

export default router;
