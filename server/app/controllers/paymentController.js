import { io } from "../../server.js";
import Registration from "../models/Registration.js";

export const makePayment = async (req, res) => {
    try {

        const registration = await Registration.findOne({
            _id: req.params.registrationId,
            userId: req.user.id
        }).populate("eventId");

        if (!registration) {
            return res.status(404).json({
                message: "Registration not found"
            });
        }

        if (registration.paymentStatus === "paid") {
            return res.status(400).json({
                message: "Payment already completed"
            });
        }

        registration.paymentStatus = "paid";
        registration.amountPaid = registration.eventId.registrationFee;

        await registration.save();

        // Realtime events
        io.emit("paymentCompleted", {
            registrationId: registration._id,
            eventId: registration.eventId._id,
            amount: registration.amountPaid
        });

        io.emit("dashboardUpdated");

        res.status(200).json({
            message: "Payment successful",
            registration
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};