import { User, ClipboardList } from 'lucide-react';
import type { MyPatient } from '../../types/patients/patient';

type Props = {
  patients: MyPatient[];
  openModal: (patient: MyPatient) => void;
}

function PatientList({ patients, openModal }: Props) {
  return (
    <div className='space-y-4'>
      {patients.length === 0 ? (
        <p className='text-gray-500 text-center'>No patients found.</p>
      ) : (
        patients.map((patient) => (
          <div
            key={patient._id}
            className='flex justify-between items-center gap-4 p-6 border border-gray-200 rounded shadow-sm'
          >
            <div className='w-12 h-12 flex items-center justify-center m-4'>
              <User size={48} className='text-blue-600 bg-blue-100 rounded-full' />
            </div>
            <div className='w-full'>
              <h4 className='text-lg font-medium mt-2 mb-2'>{`${patient.firstName} ${patient.lastName}`}</h4>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-sm text-gray-500'>
                <div>
                  <p className='mb-1'><strong>DOB:</strong> {new Date(patient.dateOfBirth).toISOString().split('T')[0]}</p>
                  <p><strong>Gender:</strong> {patient.gender}</p>
                </div>
                <div>
                  <p className='mb-1'><strong>Last appointment:</strong> {new Date(patient.lastAppointmentDate).toLocaleDateString()}</p>
                  <p><strong>Last visit reason:</strong> {patient.additionalNote}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => openModal(patient)}
              className='w-48 flex flex-col items-center gap-2 text-blue-600 cursor-pointer'
            >
              <ClipboardList size={16} />
              View
              <br />
              Intake Form
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default PatientList;