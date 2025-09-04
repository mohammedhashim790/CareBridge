import React from "react";
import HeadBarView from "../components/HeadBarView";
import Input from "../components/Input";
import SideBarView from "../components/SideBarView";
import type {ValidationResult} from "shared-modules";
import {AuthApi, validateUserInput} from "shared-modules";
import {Link, useNavigate} from "react-router-dom";
import Toast from "../../../components/toast/Toast";
import Button from "../components/Button";

const Login = () => {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const baseURL = "https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api";
    const [emailErrors, setEmailErrors] = React.useState<string[]>([]);
    const [passwordErrors, setPasswordErrors] = React.useState<string[]>([]);
    const [toast, setToast] = React.useState({
        isVisible: false,
        type: "error" as "success" | "error",
        message: "",
      });
    
    const [loading, setLoading] = React.useState(false)

    const navigate = useNavigate();

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
        loginUser(email, password)
    };

  const loginUser = async (email: string, password: string) => {
    const authApi = new AuthApi(baseURL);
    try {
      const response = await authApi.loginUser({ email, password });
      console.log(response)
      setLoading(false)
      navigate('/a')
      setToast({
        isVisible: true,
        type: "success",
        message: "Logged in successfully!",
      });
    } catch (error) {
        setLoading(false)
      let msg = "Invalid e-mail or password";
      if (error instanceof Error) msg = error.message;
      setToast({
        isVisible: true,
        type: "error",
        message: msg,
      });
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
                    Login as <span className="text-primary">Doctor</span>
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

                <div className="mt-4" style={{display: "flex", justifyContent: "space-between"}}>
                    <Link to="/forgotPassword">
                        <p className="text-xs text-primary hover:text-hover">
                            Forgot Password?
                        </p>
                    </Link>
                    <span></span>
                    <Link to="/signUp">
                        <p className="text-xs text-primary hover:text-hover">
                            Create an Account
                        </p>
                    </Link>

                </div>
            </div>
        </div>
        <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast((t) => ({ ...t, isVisible: false }))}
        />
    </div>);
};

export default Login;
