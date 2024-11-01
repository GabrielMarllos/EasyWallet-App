import axios from "axios";
import {applicationsUrl} from "../../apiConfig.js";

const http = axios.create({
    baseURL: applicationsUrl
});

export class ApplicationsService {
    getApplicationsRecruitmentProcessId(recruitmentProcessId) {
        return http.get(`/recruitment-process/${recruitmentProcessId}`);
    }
    getApplicationsByApplicantId(applicantId) {
        return http.get(`/applicant/${applicantId}`);
    }
    updateApplicationPhase(applicationId, phaseId) {
        return http.put(`/update-phase/${applicationId}?newPhaseId=${phaseId}`);
    }
    applyToJob(applicantId, recruitmentProcessId) {
        return http.post(`/apply`, {applicantId, recruitmentProcessId});
    }
    getRecruitersEmails(applicationId) {
        return http.get(`/recruiters-emails/${applicationId}`);
    }
}