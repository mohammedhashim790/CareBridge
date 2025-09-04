import React from "react";
import Button from "../components/Button";
import HeadBarView from "../components/HeadBarView";
import Input from "../components/Input";
import SideBarView from "../components/SideBarView";
import type {ValidationResult} from "shared-modules";
import {AuthApi, validateUserInput} from "shared-modules";
import {Link, useNavigate} from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const baseURL = "https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api";
    const [emailErrors, setEmailErrors] = React.useState<string[]>([]);
    const [passwordErrors, setPasswordErrors] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);

    const validateUser = (email: string, password: string) => {
        setLoading(true)
        const result: ValidationResult = validateUserInput(email, password);
        setEmailErrors([]);
        setPasswordErrors([]);

        if (!result.isValid) {
            const emailErrs = result.errors.filter((err) => err.toLowerCase().includes("email"));
            const passwordErrs = result.errors.filter((err) => err.toLowerCase().includes("password"));

            setEmailErrors(emailErrs);
            setPasswordErrors(passwordErrs);
            return;
        }
        loginUser(email, password);
    };

    const loginUser = async (email: string, password: string) => {
        const authApi = new AuthApi(baseURL);
        try {
            const response = await authApi.loginUser({email, password});
            console.log(response);
            localStorage.setItem('token', response.token);
            setLoading(false)
            navigate('/a');
        } catch (error) {
            setLoading(false)
            console.error("Login failed:", error);
        }
    };

    return (<div className="w-full h-dvh lg:flex lg:flex-row">
            {/* Heading only visible to mobile screen */}
            <HeadBarView/>

            {/* SideBar only visible to desktop */}
            <SideBarView/>

            {/* Authentication Details visible to both mobile and desktop */}
            <div className="h-3/4 lg:h-full lg:w-2/3 flex flex-col justify-center items-center">
                <div className="lg:w-full max-w-lg px-4">
                    <p className="text-2xl mb-5 lg:text-4xl lg:mb-10 text-center">
                        Login as <span className="text-primary">Patient</span>
                    </p>

                    <div className="grid gap-4 mb-5 lg:gap-6">
                        <div>
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setEmail(e.target.value);
                                }}
                            />
                            {emailErrors.length > 0 && (<div className="text-red-500 text-sm space-y-1 mt-1">
                                    {emailErrors.map((msg, i) => (<p key={i}>{msg}</p>))}
                                </div>)}
                        </div>

                        <div>
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setPassword(e.target.value);
                                }}
                            />
                            {passwordErrors.length > 0 && (<div className="text-red-500 text-sm space-y-1 mt-1">
                                    {passwordErrors.map((msg, i) => (<p key={i}>{msg}</p>))}
                                </div>)}
                        </div>
                    </div>
                        
                    <Button
                        title="Login"
                        onClick={() => {
                            validateUser(email, password);
                        }}
                        loading={loading}
                    />

                    <div className="mt-4">
                        <Link to="/forgotPassword">
                            <p className="text-xs text-primary hover:text-hover">
                                Forgot Password?
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>);
};

export default Login;
