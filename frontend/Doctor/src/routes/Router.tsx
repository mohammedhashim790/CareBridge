import {lazy, Suspense} from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {ProtectedRoute} from "../components/require_auth/RequireAuth.tsx";
import MessagesPage from "../pages/messages/messages.tsx";

const Login = lazy(() => import('../pages/authentication/login/Login'));
const ForgotPassword = lazy(() => import('../pages/authentication/forgotpassword/ForgotPassword'));
const Patients = lazy(() => import('../pages/patients/Patients'));
const PatientList = lazy(() => import('../pages/patient_profile/patient_list/PatientsList'));
const Appointment = lazy(() => import('../pages/appointment/Appointment.tsx'))
const HomePage = lazy(() => import('../homepage/HomePage.tsx'))
const AElement = lazy(() => import('../pages/a/components/AElement.tsx'))
const Dashboard = lazy(() => import('../pages/dashboard/dashboard.tsx'))
const PatientInfo = lazy(() => import('../pages/patient_profile/patient_info/PatientInfo.tsx'))
const MeetingPage = lazy(() => import('../pages/video-chat/MeetingPage.tsx'))
const SignUp = lazy(() => import('../pages/authentication/signup/SignUp.tsx'))

const Router = () => {
    return (<BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="" element={<Navigate to="/homepage"/>}/>
                <Route path="/a" element={<ProtectedRoute>
                    <AElement/>
                </ProtectedRoute>}>
                    <Route index Component={Dashboard}/>
                    <Route path="/a/patientslist" element={<PatientList/>}/>
                    <Route path="/a/patientsInfo/:id" element={<PatientInfo/>}/>
                    <Route path="/a/messages" element={<MessagesPage/>}/>
                </Route>
                <Route path="homepage" element={<HomePage/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signUp" element={<SignUp/>}/>
                <Route path="/forgotPassword" element={<ForgotPassword/>}/>
                <Route path="/patients" element={<Patients/>}/>
                <Route path="/appointment" element={<Appointment/>}/>
                <Route path="/meeting" element={<MeetingPage/>}/>
            </Routes>
        </Suspense>
    </BrowserRouter>);
}

export default Router;
