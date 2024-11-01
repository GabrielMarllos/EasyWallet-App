import axios from "axios";
import {applicantsBaseUrl } from "../../apiConfig.js";

const http = axios.create({
    baseURL: applicantsBaseUrl
});

export class ApplicantsService {
    getAll() {
        return http.get(``);
    }
    getById(id) {
        return http.get(`${id}`);
    }
    updateById(id, data) {
        return http.put(`${id}`, data);
    }
    changeCV(id, file) {
        const formData = new FormData();
        formData.append('file', file);
        return http.post(`${id}/cv`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
}