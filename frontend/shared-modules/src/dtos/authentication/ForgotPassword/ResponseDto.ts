export interface ForgotPasswordResponseDto {
  message: string;
  email: string;
}

export interface VerifyOtpResponseDto {
  message: string;
  verified: boolean;
}

export interface ResetPasswordResponseDto {
  message: string;
}
