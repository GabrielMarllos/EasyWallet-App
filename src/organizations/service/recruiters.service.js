import axios from "axios";
import {recruitersBaseUrl} from "../../apiConfig.js";

const http = axios.create({
    baseURL: recruitersBaseUrl
});

export class RecruitersService {
    hasCompany(id) {
        return http.get(`/hascompany/${id}`);
    }
    getByEmail(email) {
        return http.get(`/email/${email}`);
    }
}