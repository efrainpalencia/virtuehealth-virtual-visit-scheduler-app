import { EmailAPI } from "./authService";

export const sendAppointmentEmail = async (emailPayload: object): Promise<void> => {
    try {
        await EmailAPI.post("/email/send-appointment/", emailPayload);
    } catch (error) {
        console.error("Failed to send appointment email:", error);
        throw error;
    }
};

export default sendAppointmentEmail;