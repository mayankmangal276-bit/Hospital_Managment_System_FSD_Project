import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";

const authenticateUser = async (req, token, role, next, missingMessage) => {
    if (!token) {
        return next(new ErrorHandler(missingMessage, 400));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
        return next(new ErrorHandler("User not found!", 404));
    }

    if (req.user.role !== role) {
        return next(new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403));
    }

    next();
};

export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
    await authenticateUser(req, req.cookies.adminToken, "Admin", next, "Admin not authenticated!");
});

export const isPatientAuthenticated = catchAsyncErrors(async (req, res, next) => {
    await authenticateUser(req, req.cookies.patientToken, "Patient", next, "Please log in to continue!");
});

export const isDoctorAuthenticated = catchAsyncErrors(async (req, res, next) => {
    await authenticateUser(req, req.cookies.doctorToken, "Doctor", next, "Doctor not authenticated!");
});
