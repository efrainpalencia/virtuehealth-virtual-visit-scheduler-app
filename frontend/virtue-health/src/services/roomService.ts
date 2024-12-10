// import axios from "axios";
import { EmailAPI } from "./authService";


export const createRoom = async (): Promise<{ url: string }> => {
    const response = await EmailAPI.post("/video/proxy-create-room/", {});
    return response.data;
};

export const notifyPatient = async (email: string, roomUrl: string): Promise<void> => {
    await EmailAPI.post("/video/notify-patient/", {
        email,
        roomUrl,
    });
};