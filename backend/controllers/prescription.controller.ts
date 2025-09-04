import type { Request, Response } from 'express';
import Prescription from '../models/prescription.model.ts';
import { Doctor, Patient } from '../models/auth.model.ts';

export const createPrescription = async (req: Request, res: Response) => {
  try {
    const { doctorId, patientId, medications, notes, sharedWithPharmacy } = req.body;
    const prescription = new Prescription({
      doctorId,
      patientId,
      medications,
      notes,
      sharedWithPharmacy
    });

    await prescription.save();
    console.log(
      `Prescription created for patient ${patientId} by doctor ${doctorId}`
    );

    res
      .status(201)
      .json({ message: 'Prescription created successfully', prescription });
  } catch (error) {
    // @ts-ignore
    console.log('Error creating prescription:', error);
    res.status(500).json({ message: 'One or more fields are missing' });
  }
};

export const getPrescriptionsByPatient = async (
  req: Request,
  res: Response
) => {
  try {
    const { patientId } = req.params;
    let prescriptions: any = await Prescription.find({ patientId })
      .sort({
        createdAt: -1,
      })
      .lean();

    const results = [];

    for (let presc of prescriptions) {
      const doctor = await Doctor.findById(presc.doctorId).lean();
      const patient = await Patient.findById(presc.patientId).lean();
      if (doctor) {
        const { email, firstName, lastName, licenseNumber, specialization, phone } = doctor;
        presc.doctor = { email, licenseNumber, specialization, firstName, lastName, name: `${firstName} ${lastName}` , phone};
      }
      if (patient) {
        const { email, firstName, lastName, phone, dateOfBirth, gender } = patient;
        presc.patient = { email, firstName, lastName, phone, dateOfBirth, gender, name: `${firstName} ${lastName}` };
      }
      results.push(presc);
    }
    // @ts-ignore
    console.log(`Fetched prescriptions for patient ${patientId}`);
    res.status(200).json({ prescriptions: results });
  } catch (error) {
    // @ts-ignore
    console.log('Error fetching prescriptions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const sharePrescription = async (req: Request, res: Response) => {
  try {
    const prescriptionId = req.params.id;

    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      res.status(404).json({ message: 'Prescription not found' });
      return;
    }

    // Simulate sharing
    const pharmacyNames = [
      'GoodHealth Pharmacy',
      'MediPlus Pharmacy',
      'WellCare Drugs',
      'NovaScript Pharmacy',
      'QuickMeds RX',
      'PharmaTrust',
      'HealthyPath Pharmacy',
      'CareWell Meds',
      'VitalDose Pharmacy',
      'Sunrise Pharmacy',
    ];

    const randomPharmacy =
      pharmacyNames[Math.floor(Math.random() * pharmacyNames.length)];

    prescription.sharedWithPharmacy = {
      name: randomPharmacy,
      sharedAt: new Date(),
    };

    await prescription.save();

    console.log(
      `Prescription ${prescriptionId} shared with GoodHealth Pharmacy`
    );

    res.status(200).json({
      message: 'Prescription shared with pharmacy',
      pharmacy: prescription.sharedWithPharmacy,
    });
  } catch (error) {
    console.error('Error sharing prescription:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
