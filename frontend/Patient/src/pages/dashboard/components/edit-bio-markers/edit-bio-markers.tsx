import {useState} from "react";
import {ErrorMessage, Field, Form, Formik} from "formik";
import "./edit-bio-markers.css";
import * as Yup from "yup";

import {ChevronDown, Save, X} from "lucide-react";

import {BioMarkersService} from "../../../../../../shared-modules/src/api/bio_markers.service.ts";

const validationSchema = Yup.object({
    heartRate: Yup.number()
        .required("Heart rate is required")
        .min(30, "Heart rate must be at least 30 bpm")
        .max(220, "Heart rate must be less than 220 bpm"),
    height: Yup.string().required("Height is required"),
    weight: Yup.number()
        .required("Weight is required")
        .positive("Weight must be positive")
        .min(1, "Weight must be at least 1 kg")
        .max(500, "Weight must be less than 500 kg"),
    bloodGroup: Yup.string().required("Blood group is required"),
    allergies: Yup.array().min(1, "Please select at least one option"),
    pastIllness: Yup.string(),
})

// Options data
const allergyOptions = [{value: "none", label: "No Known Allergies"}, {
    value: "penicillin", label: "Penicillin"
}, {value: "peanuts", label: "Peanuts"}, {value: "shellfish", label: "Shellfish"}, {
    value: "eggs", label: "Eggs"
}, {value: "milk", label: "Milk/Dairy"}, {value: "soy", label: "Soy"}, {
    value: "wheat", label: "Wheat/Gluten"
}, {value: "tree_nuts", label: "Tree Nuts"}, {value: "fish", label: "Fish"}, {
    value: "latex", label: "Latex"
}, {value: "dust_mites", label: "Dust Mites"}, {value: "pollen", label: "Pollen"}, {
    value: "aspirin", label: "Aspirin"
}, {value: "ibuprofen", label: "Ibuprofen"},]

const bloodGroupOptions = [{value: "", label: "Select Blood Group"}, {value: "A+", label: "A+"}, {
    value: "A-", label: "A-"
}, {value: "B+", label: "B+"}, {value: "B-", label: "B-"}, {value: "AB+", label: "AB+"}, {
    value: "AB-", label: "AB-"
}, {value: "O+", label: "O+"}, {value: "O-", label: "O-"},]

// Initial form values
const initialValues = {
    heartRate: "72", height: "5' 8\"", weight: "70", bloodGroup: "O+", allergies: ["none"], pastIllness: "",
}

export const SimpleMedicalForm = (props:{closeDialog}) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)


    const api = new BioMarkersService("https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api");

    const handleSubmit = async (values, {setSubmitting}) => {
        setIsSubmitting(true)
        try {
            await api.createBioMarker(values);
            await new Promise((resolve) => setTimeout(resolve, 1500))
            console.log("Medical info submitted:", values)
            setSubmitSuccess(true)
            setTimeout(() => {
                setSubmitSuccess(false)
            }, 3000);

            if (props.closeDialog) {
                props.closeDialog()
            }

        } catch (error) {
            console.error("Submission error:", error)
        } finally {
            setIsSubmitting(false)
            setSubmitting(false)
        }
    }

    const MultiSelectField = ({field, form, options}) => {
        const [isOpen, setIsOpen] = useState(false)
        const selectedValues = field.value || []

        const handleToggle = (optionValue) => {
            let newValues
            if (optionValue === "none") {
                newValues = selectedValues.includes("none") ? [] : ["none"]
            } else {
                const filteredValues = selectedValues.filter((val) => val !== "none")
                if (filteredValues.includes(optionValue)) {
                    newValues = filteredValues.filter((val) => val !== optionValue)
                } else {
                    newValues = [...filteredValues, optionValue]
                }
            }
            form.setFieldValue(field.name, newValues)
        }

        const removeAllergy = (valueToRemove) => {
            const newValues = selectedValues.filter((val) => val !== valueToRemove)
            form.setFieldValue(field.name, newValues)
        }

        return (<div className="multi-select-container">
            <div className="selected-allergies">
                {selectedValues.map((value) => {
                    const option = options.find((opt) => opt.value === value)
                    return (<div key={value} className="selected-allergy">
                        <span>{option ? option.label : value}</span>
                        <button type="button" onClick={() => removeAllergy(value)}
                                className="remove-allergy">
                            <X size={14}/>
                        </button>
                    </div>)
                })}
            </div>

            <div className={`multi-select-trigger ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
                <span className="multi-select-text">Add Allergy</span>
                <ChevronDown size={16} className={`multi-select-chevron ${isOpen ? "open" : ""}`}/>
            </div>

            {isOpen && (<div className="multi-select-dropdown">
                {options.map((option) => (<div
                    key={option.value}
                    className={`multi-select-option ${selectedValues.includes(option.value) ? "selected" : ""}`}
                    onClick={() => {
                        handleToggle(option.value)
                        setIsOpen(false)
                    }}
                >
                    <span className="option-label">{option.label}</span>
                </div>))}
            </div>)}
        </div>)
    }

    return (<div className="simple-medical-form-container">
        <h1 className="form-title">Medical Information Form</h1>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({values, errors, touched, isSubmitting}) => (<Form className="medical-form">
                {/* BioMarkers Section */}
                <div className="form-section">
                    <h2 className="section-title">BioMarkers</h2>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Heart Rate:</label>
                            <div className="input-with-unit">
                                <Field type="number" name="heartRate" className="form-input"/>
                                <span className="input-unit">bpm</span>
                            </div>
                            <ErrorMessage name="heartRate" component="div" className="error-message"/>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Height:</label>
                            <Field type="text" name="height" className="form-input"
                                   placeholder="5' 8&quot;"/>
                            <ErrorMessage name="height" component="div" className="error-message"/>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Weight:</label>
                            <div className="input-with-unit">
                                <Field type="number" name="weight" className="form-input"/>
                                <span className="input-unit">kg</span>
                            </div>
                            <ErrorMessage name="weight" component="div" className="error-message"/>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Blood Group:</label>
                            <Field as="select" name="bloodGroup" className="form-select">
                                {bloodGroupOptions.map((option) => (<option key={option.value} value={option.value}>
                                    {option.label}
                                </option>))}
                            </Field>
                            <ErrorMessage name="bloodGroup" component="div" className="error-message"/>
                        </div>
                    </div>
                </div>

                {/* Allergies Section */}
                <div className="form-section">
                    <h2 className="section-title">Allergies</h2>

                    <div className="form-group full-width">
                        <Field name="allergies">
                            {({field, form}) => <MultiSelectField field={field} form={form}
                                                                  options={allergyOptions}/>}
                        </Field>
                        <ErrorMessage name="allergies" component="div" className="error-message"/>
                    </div>
                </div>

                {/* Past Illness Section */}
                <div className="form-section">
                    <h2 className="section-title">Past Illness</h2>

                    <div className="form-group full-width">
                        <Field
                            as="textarea"
                            name="pastIllness"
                            placeholder="Describe any past illnesses, surgeries, or significant medical events..."
                            className="form-textarea"
                            rows="5"
                        />
                        <ErrorMessage name="pastIllness" component="div" className="error-message"/>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`submit-button ${isSubmitting ? "submitting" : ""} ${submitSuccess ? "success" : ""}`}
                    >
                        {isSubmitting ? (<>
                            <div className="spinner"></div>
                            Saving...
                        </>) : submitSuccess ? (<>
                            <span className="success-icon">✓</span>
                            Saved Successfully!
                        </>) : (<>
                            <Save size={16}/>
                            Save Medical Information
                        </>)}
                    </button>
                </div>
            </Form>)}
        </Formik>
    </div>);
}

