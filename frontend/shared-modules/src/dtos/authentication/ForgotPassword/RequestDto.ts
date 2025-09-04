export interface ForgotPasswordRequestDto {
  email: string
}

export interface VerifyOtpRequestDto {
  email: string;
  otp: string;
}

export interface ResetPasswordRequestDto {
  email: string;
  otp: string;
  newPassword: string;
}