import {useState} from "react";
import {useNavigate} from "react-router";
import HeadBarView from "../components/HeadBarView";
import SideBarView from "../components/SideBarView";
import Input from "../components/Input";
import Button from "../components/Button";
import type {ForgotPasswordResponseDto} from "shared-modules";
import {AuthApi} from "shared-modules";

const ForgotPassword = () => {
    const baseURL = "https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api";
    const authApi = new AuthApi(baseURL);
    const navigate = useNavigate();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSendOtp = async () => {
        setLoading(true);
        try {
            const response: ForgotPasswordResponseDto = await authApi.forgotPassword({email});
            setMessage(response.message || "OTP sent to your email");
            setStep(2);
        } catch (err) {
            setLoading(false);
            setError(err?.response?.data?.message || "Failed to send OTP");
        }
    };

    const handleVerifyOtp = async () => {
        setMessage('');
        setError('');
        setLoading(true);
        try {
            const res = await authApi.verifyOtp({email, otp});
            if (res.verified) {
                setStep(3);
                setMessage(res.message || "OTP successfully verified");
            } else {
                setError("Invalid OTP");
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
            setError(err?.response?.data?.message || "Failed to verify OTP");
        }
    };

    const handleResetPassword = async () => {
        setMessage('');
        setError('');
        setLoading(true);
        try {
            const res = await authApi.resetPassword({email, otp, newPassword});
            alert(res.message || "Password successfully reset");
            navigate('/login')
        } catch (err) {
            setLoading(false);
            setError(err?.response?.data?.message || "Failed to reset password");
        }
    };

    return (<div className="w-full h-dvh lg:flex lg:flex-row">
        <HeadBarView/>
        <SideBarView/>
        <div className="h-full lg:w-2/3 flex justify-center items-center">
            <div className="max-w-lg flex flex-col gap-y-4 justify-center">
                <h2 className="text-2xl mb-4 text-center">
                    {step === 1 && "Reset Password"}
                    {step === 2 && "Verify OTP"}
                    {step === 3 && "Set New Password"}
                </h2>

                {message && <p className="text-green-600 text-center mb-2">{message}</p>}
                {error && <p className="text-red-500 text-center mb-2">{error}</p>}

                {step === 1 && (<>
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button loading={loading} title="Send OTP" onClick={handleSendOtp}/>
                </>)}

                {step === 2 && (<>
                    <Input
                        type="text"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <Button loading={loading} title="Verify OTP" onClick={handleVerifyOtp}/>
                </>)}

                {step === 3 && (<>
                    <Input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Button loading={loading} title="Reset Password" onClick={handleResetPassword}/>
                </>)}
            </div>
        </div>
    </div>);
};

export default ForgotPassword;
