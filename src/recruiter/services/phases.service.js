import axios from "axios";
import {phasesBasUrl} from "../../apiConfig.js";

const http = axios.create({
    baseURL: phasesBasUrl
});

export class RecruitmentPhaseApiService {
    createPhase (phaseData) {
        return http.post(`/create-phase`, {
            startDate: new Date(),
            endDate: new Date(),
            title: phaseData.title,
            description: phaseData.description,
            recruitmentProcessId: phaseData.recruitmentProcessId
        })
    }
    updatePhase (phaseId,phaseData) {
        return http.put(`/update-phase/${phaseId}`, {
            startDate: phaseData.startDate,
            endDate: phaseData.endDate,
            title: phaseData.title,
            description: phaseData.description,
            recruitmentProcessId: phaseData.recruitmentProcessId
        })
    }
    getPhaseById (phaseId) {
        return http.get(`/${phaseId}`)
    }
    deletePhase (phaseId) {
        return http.delete(`/${phaseId}`)
    }
}