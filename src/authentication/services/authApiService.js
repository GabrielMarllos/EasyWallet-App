import axios from "axios";
import {authBaseUrl} from "../../apiConfig.js";

const http = axios.create({
  baseURL: authBaseUrl
});

export class AuthApiService {

  async signIn(email, password) {
    try {
      const response = await http.post('/api/v1/auth/login', {
        email: email,
        password: password,
      });
      const token = response.data.token; // Ajusta según la respuesta del backend
      localStorage.setItem('jwt', token); // Guarda el token en localStorage
      return response.data; // Retorna la respuesta completa si necesitas otros datos
    } catch (error) {
      console.error("Error during sign-in:", error);
      throw error; // Lanza el error para manejarlo en los componentes
    }
  }

  signOut() {
    localStorage.removeItem('jwt'); // Elimina el token JWT al cerrar sesión
  }

  // signUpRecruiter(firstName, lastName, country, email, password, phoneNumber, profilePictureUrl) {
  //   return http.post('register-recruiter', {
  //     firstname: firstName,
  //     lastname: lastName,
  //     email: email,
  //     password: password,
  //     phoneNumber: phoneNumber,
  //     profilePictureUrl: profilePictureUrl,
  //     country: country,
  //   })
  // }
  //
  // signUpApplicant(firstName, lastName, country, email, password, phoneNumber, profilePictureUrl) {
  //   return http.post('register-applicant', {
  //     firstname: firstName,
  //     lastname: lastName,
  //     email: email,
  //     password: password,
  //     phoneNumber: phoneNumber,
  //     profilePictureUrl: profilePictureUrl,
  //     country: country,
  //   })
  // }
  //
  // signIn(email, password) {
  //   return http.post('login', {
  //     email: email,
  //     password: password
  //   })
  // }
  //
  // logout() {
  //   localStorage.removeItem('user');
  // }
}
