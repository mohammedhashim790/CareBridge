import HeadBarView from "../components/HeadBarView";
import SideBarView from "../components/SideBarView";
import {AuthApi} from "shared-modules";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";

const SignUp = () => {
    const baseURL = "https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api";

    const [errorMessage, setErrorMessage] = useState(undefined);

    const specializations = [{value: "cardiology", label: "Cardiology"}, {
        value: "dermatology", label: "Dermatology"
    }, {value: "emergency", label: "Emergency Medicine"}, {
        value: "family", label: "Family Medicine"
    }, {value: "internal", label: "Internal Medicine"}, {value: "neurology", label: "Neurology"}, {
        value: "oncology", label: "Oncology"
    }, {value: "orthopedics", label: "Orthopedics"}, {value: "pediatrics", label: "Pediatrics"}, {
        value: "psychiatry", label: "Psychiatry"
    }, {value: "radiology", label: "Radiology"}, {value: "surgery", label: "Surgery"},];

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required("First name is required"),
        lastName: Yup.string().required("Last name is required"),
        phone: Yup.string().required("Phone number is required"),
        licenseNumber: Yup.string().required("License number is required"),
        specialization: Yup.string().required("Specialization is required"),
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("Password is required"),
    });

    const navigator = useNavigate();

    const registerUser = async (values: any) => {
        const authApi = new AuthApi(baseURL);
        try {
            await authApi.registerUser(values);
            navigator('/a');
        } catch (error:any) {
            setErrorMessage(error.message);
        }
    };

    return (<div className="w-full h-dvh lg:flex lg:flex-row">
        <HeadBarView/>
        <SideBarView/>
        <div className="h-3/4 lg:h-full lg:w-2/3 flex flex-col justify-center items-center">
            <div className="lg:w-full max-w-lg px-4">
                <p className="text-2xl mb-5 lg:text-4xl lg:mb-10 text-center">
                    Sign Up as <span className="text-primary">Doctor</span>
                </p>

                <Formik
                    initialValues={{
                        firstName: "",
                        lastName: "",
                        phone: "",
                        licenseNumber: "",
                        specialization: "",
                        email: "",
                        password: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        registerUser(values);
                    }}
                >
                    <Form className="grid gap-4 mb-5 lg:gap-6">
                        <div>
                            <Field
                                name="firstName"
                                placeholder="First Name"
                                type="text"
                                className="w-80 h-10 border border-border rounded-md pl-3 text-sm lg:w-120 lg:h-13"
                            />
                            <ErrorMessage
                                name="firstName"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        <div>
                            <Field
                                name="lastName"
                                placeholder="Last Name"
                                type="text"
                                className="w-80 h-10 border border-border rounded-md pl-3 text-sm lg:w-120 lg:h-13"
                            />
                            <ErrorMessage
                                name="lastName"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        <div>
                            <Field
                                name="email"
                                placeholder="Email"
                                type="email"
                                className="w-80 h-10 border border-border rounded-md pl-3 text-sm lg:w-120 lg:h-13"
                            />
                            <ErrorMessage
                                name="email"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        <div>
                            <Field
                                name="password"
                                placeholder="Password"
                                type="password"
                                className="w-80 h-10 border border-border rounded-md pl-3 text-sm lg:w-120 lg:h-13"
                            />
                            <ErrorMessage
                                name="password"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        <div>
                            <Field
                                name="phone"
                                placeholder="Phone Number"
                                type="text"
                                className="w-80 h-10 border border-border rounded-md pl-3 text-sm lg:w-120 lg:h-13"
                            />
                            <ErrorMessage
                                name="phone"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        <div>
                            <Field
                                name="licenseNumber"
                                placeholder="License Number"
                                type="text"
                                className="w-80 h-10 border border-border rounded-md pl-3 text-sm lg:w-120 lg:h-13"
                            />
                            <ErrorMessage
                                name="licenseNumber"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        <div>
                            <Field
                                as="select"
                                name="specialization"
                                className="w-80 h-10 border border-border rounded-md pl-3 text-sm lg:w-120 lg:h-13"
                            >
                                <option value="">Select Specialization</option>
                                {specializations.map((specialty) => (
                                    <option key={specialty.value} value={specialty.value}>
                                        {specialty.label}
                                    </option>))}
                            </Field>
                            <ErrorMessage
                                name="specialization"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                            />
                        </div>

                        <span className="text-red-500 text-sm">{errorMessage}</span>

                        <button type={"submit"}
                                className="w-80 h-12 bg-primary hover:bg-hover active:bg-active justify-items-center content-center rounded-lg shadow-md mb-2 lg:w-120 lg:h-15">
                            <p className="text-white tracking-wider text-center">Sign Up</p>
                        </button>
                        <Link to="/login">
                            <p className="text-xs text-primary hover:text-hover">
                                Have an account? Login here.
                            </p>
                        </Link>

                    </Form>
                </Formik>

            </div>
        </div>
    </div>);
};

export default SignUp;
