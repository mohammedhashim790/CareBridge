import React, {useRef, useState} from 'react';
import './upload-file.css';
import '../prescription-generator/prescription-generator.css';
import AWS from 'aws-sdk';
import {FileService} from "../../../../../../shared-modules/src/api/file.service.ts";
import {getCurrentUser} from "shared-modules/src/user_auth/user_auth";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";


const accessKey = "";
const secretAccessKey = "";

export const uploadFile = async (file: File, S3_BUCKET: string, key: string) => {
    const REGION = "ca-central-1";
    const Key = `documents/${key}.${file.name.split('.').pop() ?? 'pdf'}`;
    AWS.config.update({
        accessKeyId: accessKey, secretAccessKey: secretAccessKey,
    });
    const s3 = new AWS.S3({
        params: {Bucket: S3_BUCKET}, region: REGION,
    });

    const params = {
        Bucket: S3_BUCKET, Key: Key, Body: file, ContentType: file.type,
    };

    var upload = s3
        .putObject(params)
        .on("httpUploadProgress", (evt) => {
            console.debug("Uploading " + parseInt(String((evt.loaded * 100) / evt.total)) + "%");
            return;
        })
        .promise();

    await upload.then((res) => {
        console.debug(res);
    }).catch((err) => {
        console.error(err);
    })
    console.debug('Upload complete');

    return Key;
}

const UploadFile: React.FC = (props: { patient: any }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const baseURL = "https://wckhbleqhi.execute-api.ca-central-1.amazonaws.com/prod/api";
    const S3_BUCKET = "carebridge-assets";

    const [note, setNote] = useState("");
    const [fileType, setFileType] = useState("");

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === 'dragenter' || e.type === 'dragover');
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (selectedFile: File) => {
        setFile(selectedFile);
    };

    const uploadObject = async (file: File, formValues): Promise<void> => {
        console.log('Uploading:', file.name);
        let key = `${Date.now()}${Date.now() + Date.now() + (Math.random() * 100)}`;
        key = await uploadFile(file, S3_BUCKET, key);
        const user = getCurrentUser();
        const api = new FileService(baseURL);
        debugger;
        if (key) {
            await api.create({
                doctorId: user.id,
                patientId: props.patient._id,
                name: file.name,
                key: key,
                bucket: S3_BUCKET,
                note: formValues.note,
                fileType: formValues.DocumentType,
            });
        }
        window.location.reload();
    };

    const handleUploadClick = async (formValues) => {
        if (!file) return;
        setUploading(true);
        try {
            await uploadObject(file, formValues);
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setUploading(false);
        }
    };

    const openFileDialog = () => {
        inputRef.current?.click();
    };

    const documentTypes = [{value: "prescription", label: "Prescription"}, {
        value: "Lab Report", label: "Lab Report"
    }, {value: "Imaging", label: "Imaging (X-ray, MRI, CT)"}, {
        value: "Discharge Summary", label: "Discharge Summary"
    }, {
        value: "Surgical Report", label: "Surgical Report"
    }, {value: "Pathology Report", label: "Pathology Report"}, {
        value: "Vaccination Record", label: "Vaccination Record"
    }, {value: "Medical Certificate", label: "Medical Certificate"}, {
        value: "Treatment Plan", label: "Treatment Plan"
    }, {value: "Progress Notes", label: "Progress Notes"}, {
        value: "Allergy Record", label: "Allergy Record"
    }, {value: "Insurance Claim Document", label: "Insurance Claim Document"}, {
        value: "Consent Form", label: "Consent Form"
    }];


    const validationSchema = Yup.object().shape({
        note: Yup.string().notRequired(), DocumentType: Yup.string().required("Document Type is required"),
    });

    return (<div
        className="drop-zone-container"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
    >
        <Formik initialValues={{note: "", DocumentType: ""}} validationSchema={validationSchema}
                onSubmit={handleUploadClick}>
            <Form style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px'}}
                  className="grid gap-4 mb-5 lg:gap-6">
                <div>
                    <Field
                        name="note"
                        placeholder="Notes"
                        type="text"
                        className="w-80 h-10 border border-border rounded-md pl-3 text-sm lg:w-120 lg:h-13"
                    />
                    <ErrorMessage
                        name="note"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                    />
                </div>
                <div>
                    <Field
                        as="select"
                        name="DocumentType"
                        className="w-80 h-10 border border-border rounded-md pl-3 text-sm lg:w-120 lg:h-13"
                    >
                        <option value="">Select Document Type</option>
                        {documentTypes.map((specialty) => (<option key={specialty.value} value={specialty.value}>
                            {specialty.label}
                        </option>))}
                    </Field>
                    <ErrorMessage
                        name="specialization"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                    />
                </div>
                <div className={`file-dropzone ${dragActive ? 'active' : ''}`} onClick={openFileDialog}>
                    <input
                        ref={inputRef}
                        type="file"
                        accept="*"
                        style={{display: 'none'}}
                        onChange={handleChange}
                    />
                    <p className="file-dropzone-text">
                        {file ? `Selected file: ${file.name}` : 'Drag & drop your file here or click to upload'}
                    </p>
                </div>

                <button
                    className="upload-btn"
                    type={"submit"}
                    disabled={uploading || !file}
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </Form>
        </Formik>


    </div>);
};

export default UploadFile;
