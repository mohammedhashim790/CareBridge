import {useState} from "react"
import {Calendar, Mail, MapPin, Phone, User} from "lucide-react"
import "./patient-register.css"
import {AuthApi} from "../../../../../shared-modules";

export interface PatientRegisterProps {
    email: string | undefined,
    password: string | undefined,
    firstName: string | undefined,
    lastName: string | undefined,
    phone: string | undefined,
    address: {
        street: string | undefined,
        city: string | undefined,
        state: string | undefined,
        postalCode: string | undefined,
        country: string | undefined,
    },
    dateOfBirth: string | undefined,
    gender: string | undefined,
}

export default function PatientRegister({onClose, onPatientAdded}) {

    const baseURL = "https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api";
    const [formData, setFormData] = useState<PatientRegisterProps>({
        email: "mohammedhashim881@gmail.com",
        password: "Test@123",
        firstName: "Mohammed",
        lastName: "Hashim",
        phone: "7828991303",
        address: {
            street: "STREET", city: "HALIFAX", state: "NS", postalCode: "B123ASD", country: "Canada",
        },
        dateOfBirth: "",
        gender: "male",
    })
    const [errors, setErrors] = useState<PatientRegisterProps>({
        email: undefined, password: undefined, firstName: undefined, lastName: undefined, phone: undefined, address: {
            street: undefined, city: undefined, state: undefined, postalCode: undefined, country: undefined,
        }, dateOfBirth: undefined, gender: undefined,
    })
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(undefined);

    const today = new Date().toISOString().split('T')[0];

    const registerPatient = async (values: any) => {
        const authApi = new AuthApi(baseURL);
        return await authApi.registerPatient(values);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target

        if (name.startsWith("address.")) {
            const addressField = name.split(".")[1]
            setFormData((prev) => ({
                ...prev, address: {
                    ...prev.address, [addressField]: value,
                },
            }))
        } else {
            setFormData((prev) => ({
                ...prev, [name]: value,
            }))
        }

        setErrors((prev) => ({
            ...prev, [name]: "",
        }))
    }

    const validateForm = () => {
        let newErrors: any = {};

        if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid"
        }
        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters"
        }
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
        if (!formData.address.street.trim()) newErrors["address.street"] = "Street address is required"
        if (!formData.address.city.trim()) newErrors["address.city"] = "City is required"
        if (!formData.address.state.trim()) newErrors["address.state"] = "State/Province is required"
        if (!formData.address.postalCode.trim()) newErrors["address.postalCode"] = "Postal code is required"
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            setErrorMessage("Please correct the errors below");
            return;
        }

        setIsSubmitting(true)

        try {
            const patient = await registerPatient(formData);
            const newPatient = {
                id: Date.now(),
                name: `${formData.firstName} ${formData.lastName}`,
                mobile: formData.phone,
                email: formData.email,
                photo: "/placeholder.svg?height=40&width=40",
                paymentStatus: "Pending",
                patientId: patient.user.patientId
            }
            // if (onPatientAdded) {
            //     onPatientAdded(newPatient)
            // }

            onClose()
            window.location.reload();
        } catch (error) {
            setErrorMessage(error.message ?? JSON.stringify(error));
        } finally {
            setIsSubmitting(false)
        }
    }

    return (<div className="patient-register-container">
        <form onSubmit={handleSubmit} className="patient-register-form">
            <div className="form-section">
                <div className="section-header">
                    <User className="section-icon" size={20}/>
                    <h3 className="section-title">Personal Information</h3>
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="firstName" className="form-label">
                            First Name *
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`form-input ${errors?.firstName ? "error" : ""}`}
                            placeholder="Enter first name"
                        />
                        {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName" className="form-label">
                            Last Name *
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`form-input ${errors.lastName ? "error" : ""}`}
                            placeholder="Enter last name"
                        />
                        {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                    </div>
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="dateOfBirth" className="form-label">
                            <Calendar size={16} className="inline mr-1"/>
                            Date of Birth *
                        </label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            className={`form-input ${errors.dateOfBirth ? "error" : ""}`}
                            max={today}
                        />
                        {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="gender" className="form-label">
                            Gender
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="form-input"
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <div className="section-header">
                    <Mail className="section-icon" size={20}/>
                    <h3 className="section-title">Contact Information</h3>
                </div>

                <div className="form-group">
                    <label htmlFor="email" className="form-label">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`form-input ${errors.email ? "error" : ""}`}
                        placeholder="Enter email address"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                        <Phone size={16} className="inline mr-1"/>
                        Phone Number *
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`form-input ${errors.phone ? "error" : ""}`}
                        placeholder="Enter phone number"
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
            </div>

            <div className="form-section">
                <div className="section-header">
                    <MapPin className="section-icon" size={20}/>
                    <h3 className="section-title">Address Information</h3>
                </div>

                <div className="form-group">
                    <label htmlFor="address.street" className="form-label">
                        Street Address *
                    </label>
                    <input
                        type="text"
                        id="address.street"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        className={`form-input ${errors["address.street"] ? "error" : ""}`}
                        placeholder="Enter street address"
                    />
                    {errors["address.street"] && <span className="error-message">{errors["address.street"]}</span>}
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="address.city" className="form-label">
                            City *
                        </label>
                        <input
                            type="text"
                            id="address.city"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleInputChange}
                            className={`form-input ${errors["address.city"] ? "error" : ""}`}
                            placeholder="Enter city"
                        />
                        {errors["address.city"] && <span className="error-message">{errors["address.city"]}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="address.state" className="form-label">
                            State/Province *
                        </label>
                        <input
                            type="text"
                            id="address.state"
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleInputChange}
                            className={`form-input ${errors["address.state"] ? "error" : ""}`}
                            placeholder="Enter state/province"
                        />
                        {errors["address.state"] && <span className="error-message">{errors["address.state"]}</span>}
                    </div>
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="address.postalCode" className="form-label">
                            Postal Code *
                        </label>
                        <input
                            type="text"
                            id="address.postalCode"
                            name="address.postalCode"
                            value={formData.address.postalCode}
                            onChange={handleInputChange}
                            className={`form-input ${errors["address.postalCode"] ? "error" : ""}`}
                            placeholder="Enter postal code"
                        />
                        {errors["address.postalCode"] &&
                            <span className="error-message">{errors["address.postalCode"]}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="address.country" className="form-label">
                            Country
                        </label>
                        <select
                            id="address.country"
                            name="address.country"
                            value={formData.address.country}
                            onChange={handleInputChange}
                            className="form-input"
                        >
                            <option value="Canada">Canada</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                        </select>
                    </div>
                </div>
            </div>
            <span className="text-red-500 text-sm">{errorMessage}</span>
            <div className="form-actions">
                <button type="button" onClick={onClose} className="btn-secondary" disabled={isSubmitting}>
                    Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Registering..." : "Register Patient"}
                </button>
            </div>
        </form>
    </div>)
}
