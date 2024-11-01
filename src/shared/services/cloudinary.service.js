import axios from "axios";
import {cloudinaryUrl} from "../../apiConfig.js";

const http = axios.create({
    baseURL: cloudinaryUrl
});

export class CloudinaryService {
    uploadPicture(file) {
        const formData = new FormData();
        formData.append("file", file);
        return http.post(``, formData);
    }
}