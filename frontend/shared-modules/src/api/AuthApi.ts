import {HttpClient} from "./HttpClient";
import type {LoginRequestDto} from "../dtos/authentication/Login/LoginRequestDto";
import type {
    ForgotPasswordResponseDto,
    ResetPasswordResponseDto,
    VerifyOtpResponseDto,
} from "../dtos/authentication/ForgotPassword/ResponseDto";
import type {SignUpDTO} from "../dtos/authentication/SignUp/SignUpDTO";
import {getAuthToken, storeAuthToken} from "../user_auth/user_auth";
import type {
    ForgotPasswordRequestDto,
    ResetPasswordRequestDto,
    VerifyOtpRequestDto,
} from "../dtos/authentication/ForgotPassword/RequestDto";

export class AuthApi extends HttpClient {
    baseUrl: string;

    constructor(baseURL: string) {
        super();
        this.baseUrl = baseURL;
    }

    async loginUser(data: LoginRequestDto): Promise<any> {
        const result: any = await this.post(this.baseUrl + "/auth/login", data);
        storeAuthToken(result.token);
        return result;
    }

    async registerUser(data: SignUpDTO): Promise<{ user: any, token: any }> {
        const result = await this.post<{ user: any, token: any }>(this.baseUrl + "/auth/register/doctor", data);
        storeAuthToken(result.token);
        return result;
    }

    async registerPatient(data: SignUpDTO): Promise<{ user: any, token: any }> {
        const result = await this.post<{ user: any, token: any }>(this.baseUrl + "/auth/register/patient", data, {
            token: getAuthToken() as any
        });
        return result;
    }

    async forgotPassword(data: ForgotPasswordRequestDto): Promise<ForgotPasswordResponseDto> {
        const res = await this.post<ForgotPasswordResponseDto>(this.baseUrl + "/auth/forgot-password", data)
        return res;
    }

    async verifyOtp(data: VerifyOtpRequestDto): Promise<VerifyOtpResponseDto> {
        const res = await this.post<VerifyOtpResponseDto>(this.baseUrl + "/auth/verify-otp", data);
        return res;
    }

    async resetPassword(data: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto> {
        const res = await this.post<ResetPasswordResponseDto>(this.baseUrl + "/auth/reset-password", data);
        return res;
    }

}
