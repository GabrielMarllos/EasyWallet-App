import axios from "axios";
import {emailUrl} from "../../apiConfig.js";

const http = axios.create({
    baseURL: emailUrl
});

export class EmailService {
    getSentEmailsByEmail(email) {
        return http.get(`sent-emails`, {params: {email: email}});
    }
    getReceivedEmailsByEmail(email) {
        return http.get(`received-emails`, {params: {email: email}});
    }
    sendEmail(to, cc, sender, subject, body) {
        return http.post('send-email', {
            to: to, // List<String>
            cc: cc, // List<String>
            sender: sender, // String
            subject: subject, // String
            body: body // String
        });
    }
}