import { LoginData, RegisterData, CreateUserData } from "@/app/(auth)/_components/schema"
import axios from "./axios"
import { API } from "./endpoints"


export const register = async (registerData: RegisterData) => {
    try {
        console.log(registerData)
        const response = await axios.post(API.AUTH.REGISTER, registerData)
        return response.data
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Registration failed')
    }
}

export const login = async (loginData: LoginData) => {
    try {
        const response = await axios.post(API.AUTH.LOGIN, loginData)
        return response.data
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Login failed')
    }
}

export const createUser = async (userData: CreateUserData) => {
    try {
        const formData = new FormData();
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('role', userData.role);

        const response = await axios.post(API.AUTH.CREATE_USER, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'User creation failed')
    }
}