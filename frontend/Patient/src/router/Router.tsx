import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../pages/require_auth/RequireAuth.tsx";


const Login = lazy(() => import('../pages/authentication/login/Login'));
const ForgotPassword = lazy(() => import('../pages/authentication/forgotpassword/ForgotPassword'));
const IntakeFrom = lazy(() => import('../pages/intake-form/CreateIntakeForm')); // creation
const ViewIntakeForm = lazy(() => import('../pages/intake-form/ViewIntakeForm'));
const UpdateIntakeForm = lazy(() => import('../pages/intake-form/UpdateIntakeFrom'));
const MeetingPage = lazy(()=> import('../pages/video-call/MeetingPage.tsx'))
const AElement = lazy(() => import('../pages/a/components/AElement.tsx'))
const EHR = lazy(()=> import('../pages/ehr/ehr.tsx'))
const MedicalRecords = lazy(()=> import('../pages/medical-records/medical-records.tsx'))
const PatientDashboard = lazy(()=> import('../pages/dashboard/dashboard.tsx'))
const Presciptions = lazy(()=> import('../pages/prescriptions/presciptions.tsx'))
const MessagesPage = lazy(() => import('../pages/messages/messages.tsx'))



const Router = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={
                        <ProtectedRoute children={
                            <Navigate to="/a"></Navigate>
                        }></ProtectedRoute>
                    }></Route>
                    <Route path="/a" element={<AElement />}>
                        <Route index element={<PatientDashboard />}/>
                        <Route path="/a/ehr" element={<EHR />} />
                        <Route path="/a/records" element={<MedicalRecords />} />
                        <Route path="/a/intakeForm/create" element={<IntakeFrom />} />
                        <Route path="/a/intakeForm/view" element={<ViewIntakeForm />} />
                        <Route path="/a/intakeForm/update" element={<UpdateIntakeForm />} />
                        <Route path="/a/prescription" element={<Presciptions />}/>
                        {/*<Route path="/a/messages" element={<MessagesPage />} />*/}
                    </Route>
                        <Route path="/meeting" element={<MeetingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgotPassword" element={<ForgotPassword />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default Router;
