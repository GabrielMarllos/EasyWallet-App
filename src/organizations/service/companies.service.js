import axios from "axios";
import {companiesBaseUrl} from "../../apiConfig.js";

const http = axios.create({
    baseURL: companiesBaseUrl
});

export class CompaniesService {
    getCompanyById(id) {
        return http.get(`/${id}`);
    }

    updateCompanyById (id, data) {
        return http.put(`/update/${id}`,data);
    }

    addRecruitersToCompany (companyId,recruiterEmail) {
        return http.put(`${companyId}/add/recruiters/${recruiterEmail}`);
    }

    removeRecruiterFromCompany (companyId,recruiterEmail) {
        return http.put(`${companyId}/delete/recruiters/${recruiterEmail}`);
    }

    getRecruitersByCompanyId(companyId) {
        return http.get(`/${companyId}/recruiters`);
    }

    createCompany (companyData,recruiterId) {
        console.log(companyData.name);
        return http.post(`/create/${recruiterId}`, {
            name: companyData.name,
            description: companyData.description,
            country: companyData.country,
            address: companyData.address,
            logoUrl: companyData.logoUrl,
            website: companyData.website,
            industry: companyData.industry,
        });
    }
}