export interface LoginResponseDto {
    token: string
    user: {
        id: string
        email: string
        userType: "doctor" | "patient"
        firstName: string
        lastName: string
    }
}