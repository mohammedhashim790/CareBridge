export const nameToInitials = (firstName: string, lastName?: string) => {
    return firstName.charAt(0) + (lastName ? lastName.charAt(0) : '');
}

export const calculateAge = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
}

export const prettyDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString();
}

export const prettyAddress = (address: any) => {
    return `${address.street}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`;
}






