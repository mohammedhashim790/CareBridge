let jwtDecode: (arg0: string) => any;

export const setJwtDecode = (jwt_decode: any) => {
    jwtDecode = jwt_decode;
};


export interface User {
    firstName: string;
    lastName: string;
    phone: string;
    licenseNumber: string;
    specialization: string;
    email: string;
    id: string;
    userType: string;
    customId:string
}

export const storeAuthToken = (token: string): void => {
    const storage = sessionStorage;
    storage.setItem('authToken', token);
};

export const getAuthToken = (): string | null => {
    return sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
};

export const getCurrentUser = (): User | null => {
    const token = getAuthToken();
    if (!token) return null;

    try {
        const decoded: any = jwtDecode(token);
        return {
            firstName: decoded.firstName || decoded.given_name,
            lastName: decoded.lastName || decoded.family_name,
            phone: decoded.phone,
            licenseNumber: decoded.licenseNumber,
            specialization: decoded.specialization,
            email: decoded.email,
            id: decoded.id,
            userType: decoded.userType,
            customId: decoded.customId
        };
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};

export const clearAuthToken = (): void => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
};

export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};
