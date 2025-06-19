import axios from "axios";

export const forgotPassword = async (correo) => {
    try {
        const response = await axios.post("https://apijeff.jsebastiandq.com/api/auth/forgot-password", {
            correo
        });
        console.log("Respuesta:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error);
        throw error;
    }
};
