import React from 'react';
import {ErrorMessage, Field, FieldArray, Form, Formik} from 'formik';
import * as Yup from 'yup';
import './prescription.css';
import type {PrescriptionFormValues} from './util/prescriptions.types.ts';
import type {PatientInfo} from "../patient_profile/patient_info/PatientInfo.tsx";
import {getCurrentUser} from "../../../../shared-modules/src/user_auth/user_auth.ts";
import {Prescription} from "../../../../shared-modules/src/api/prescription.service.ts";

export const PrescriptionForm: React.FC = (props: { patient?: PatientInfo }) => {

    const doctorData = getCurrentUser();

    const baseURL = "https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api";


    const patient = props.patient ?? {
        firstName: 'John',
        lastName: 'Doe',
        email: '<EMAIL>',
        phone: '1234567890',
        licenseNumber: '1234567890',
        address: '123 Main St, New York, NY 10001',
        birthDate: '1990-01-01',
        gender: 'male',
        height: 170,
    };

    const initialValues: PrescriptionFormValues = {
        patientName: patient.firstName + ' ' + patient.lastName,
        issueDate: new Date(Date.now()).toISOString().substr(0, 10),
        drugs: [{
            name: 'Amoxicillin', dosage: '500mg', frequency: '3 Times a day', id: new Date().getTime().toString()
        }, {
            name: 'Paracetamol', dosage: '650mg', frequency: 'Twice daily', id: new Date().getTime().toString()
        }],
        doctorName: doctorData.firstName + ' ' + doctorData.lastName,
        doctorContact: {
            telephone: doctorData.phone, registrationNumber: doctorData.licenseNumber,
        },
        signature: '',
        sharedWithPharmacy: {
            name: '', sharedAt: new Date()
        },
        notes: 'Patient advised to complete the full course and report if symptoms persist.'
    };

    const validationSchema = Yup.object().shape({
        patientName: Yup.string()
            .min(3, 'Patient name must be at least 3 characters')
            .required('Patient name is required'), issueDate: Yup.date()
            .required('Issue date is required'), drugs: Yup.array().of(Yup.object().shape({
            name: Yup.string().required('Drug name is required'),
            dosage: Yup.string().required('dosage is required'),
            frequency: Yup.string().required('frequency is required'),
        })), signature: Yup.string()
            .min(3, 'Signature must be at least 3 characters')
            .required('Signature is required'), notes: Yup.string()
            .min(3, 'Notes must be at least 3 characters')
            .required('Notes is required'),

    });

    const handleSubmit = async (values: PrescriptionFormValues) => {
        const refactoredValues = {
            doctorId: doctorData.id,
            patientId: (patient as any)._id,
            medications: values.drugs,
            notes: values.notes,
            sharedWithPharmacy: values.sharedWithPharmacy,
        }
        const prescriptionService = new Prescription(baseURL);
        const res = await prescriptionService.create(refactoredValues);
        window.location.reload();
    };


    return (<div className="prescription-form-container">
        <h2>Electronic Prescription Form</h2>

        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({values, isValid, dirty}) => (<Form className="prescription-form">
                {/* Patient Information */}
                <div className="form-section">
                    <h3>Patient Information</h3>
                    <div className="form-group">
                        <label htmlFor="patientName">Patient's Full Name:</label>
                        <Field
                            type="text"
                            name="patientName"
                            id="patientName"
                            disabled
                        />
                        <ErrorMessage name="patientName" component="div" className="error-message"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="issueDate">Date Prescription Issued:</label>
                        <Field
                            type="date"
                            name="issueDate"
                            id="issueDate"
                        />
                        <ErrorMessage name="issueDate" component="div" className="error-message"/>
                    </div>
                </div>

                {/* Prescribed Medication(s) */}
                <div className="form-section">
                    <h3>Prescribed Medication(s)</h3>
                    <FieldArray name="drugs">
                        {({push, remove}) => (<>
                            {values.drugs.map((drug, index) => (<div key={drug.id} className="drug-entry">
                                <div className="form-group">
                                    <label htmlFor={`drugs.${index}.name`}>Drug Name:</label>
                                    <Field
                                        type="text"
                                        name={`drugs.${index}.name`}
                                        id={`drugs.${index}.name`}
                                    />
                                    <ErrorMessage
                                        name={`drugs.${index}.name`}
                                        component="div"
                                        className="error-message"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`drugs.${index}.dosage`}>Dosage:</label>
                                    <Field
                                        type="text"
                                        name={`drugs.${index}.dosage`}
                                        id={`drugs.${index}.dosage`}
                                    />
                                    <ErrorMessage
                                        name={`drugs.${index}.dosage`}
                                        component="div"
                                        className="error-message"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor={`drugs.${index}.frequency`}>Frequency:</label>
                                    <Field
                                        type="text"
                                        name={`drugs.${index}.frequency`}
                                        id={`drugs.${index}.frequency`}
                                    />
                                    <ErrorMessage
                                        name={`drugs.${index}.frequency`}
                                        component="div"
                                        className="error-message"
                                    />
                                </div>
                                {values.drugs.length > 1 && (<button
                                    type="button"
                                    className="remove-drug-btn"
                                    onClick={() => remove(index)}
                                >
                                    Remove
                                </button>)}
                            </div>))}
                            <button
                                type="button"
                                className="add-drug-btn"
                                onClick={() => push({
                                    id: Date.now().toString(), name: '', dosage: '', form: '', quantity: ''
                                })}
                            >
                                Add Another Medication
                            </button>
                        </>)}
                    </FieldArray>
                </div>

                {/* Prescribing Doctor */}
                <div className="form-section">
                    <h3>Prescribing Doctor</h3>
                    <div className="form-group">
                        <label htmlFor="doctorName">Doctor's Name:</label>
                        <Field
                            type="text"
                            name="doctorName"
                            id="doctorName"
                            disabled
                        />
                    </div>

                    <div className="form-group">
                        <label>Address:</label>
                        <Field
                            type="text"
                            name="doctorContact.address"
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label>Telephone Number:</label>
                        <Field
                            type="tel"
                            name="doctorContact.telephone"
                            disabled
                        />
                    </div>
                    <div className="form-group">
                        <label>Registration Number:</label>
                        <Field
                            type="text"
                            name="doctorContact.registrationNumber"
                            disabled
                        />
                    </div>
                </div>

                {/* Usage Instructions */}
                <div className="form-section">
                    <h3>Usage Instructions</h3>
                    <div className="form-group">
                        <label htmlFor="notes">Note for the patient:</label>
                        <Field
                            as="textarea"
                            name="notes"
                            id="notes"
                        />
                        <ErrorMessage name="notes" component="div" className="error-message"/>
                    </div>
                </div>


                {/* Drug Store Recommendation (Optional) */}
                <div className="form-section">
                    <h3>Drug Store Recommendation (Optional)</h3>
                    <div className="form-group">
                        <label htmlFor="sharedWithPharmacy.name">Intended Pharmacy Name:</label>
                        <Field
                            type="text"
                            name="sharedWithPharmacy.name"
                            id="sharedWithPharmacy.name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sharedWithPharmacy.sharedAt">Date:</label>
                        <Field
                            type="datetime-local"
                            name="sharedWithPharmacy.sharedAt"
                            id="sharedWithPharmacy.sharedAt"
                        />
                    </div>
                </div>

                {/* Authorization */}
                <div className="form-section">
                    <h3>Authorization</h3>
                    <div className="form-group">
                        <label htmlFor="signature">Doctor's Signature (Type full name as digital
                            signature):</label>
                        <Field
                            type="text"
                            name="signature"
                            id="signature"
                        />
                        <ErrorMessage name="signature" component="div" className="error-message"/>
                    </div>
                    <div className="security-notice">
                        <p>
                            <strong>Security Notice:</strong> This Prescription is secure and compliant with
                            patient
                            confidentiality regulations. It can only be received by the intended licensed
                            pharmacy.
                        </p>
                    </div>
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={!isValid || !dirty}
                >
                    Submit Prescription
                </button>
            </Form>)}
        </Formik>
    </div>);
};
