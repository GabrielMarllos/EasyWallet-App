import axios from "axios";
import {authBaseUrl} from "../../apiConfig.js";

const http = axios.create({
  baseURL: authBaseUrl
});

export class AuthApiService {

  signUpRecruiter(firstName, lastName, country, email, password, phoneNumber, profilePictureUrl) {
    return http.post('register-recruiter', {
      firstname: firstName,
      lastname: lastName,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
      profilePictureUrl: profilePictureUrl,
      country: country,
    })
  }

  signUpApplicant(firstName, lastName, country, email, password, phoneNumber, profilePictureUrl) {
    return http.post('register-applicant', {
      firstname: firstName,
      lastname: lastName,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
      profilePictureUrl: profilePictureUrl,
      country: country,
    })
  }

  signIn(email, password) {
    return http.post('login', {
      email: email,
      password: password
    })
  }

  logout() {
    localStorage.removeItem('user');
  }
}
