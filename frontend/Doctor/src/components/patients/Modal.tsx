import { X } from 'lucide-react';
import IntakeForm from './IntakeForm';
import type { MyPatient } from '../../types/patients/patient';

type ModalProps = {
  closeModal: () => void;
  selectedPatient: MyPatient;
};

function Modal( { closeModal, selectedPatient }: ModalProps ) {
  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-8 max-w-md w-full shadow-lg relative'>
        <button
          onClick={closeModal}
          className='absolute top-2 right-2 text-gray-400 cursor-pointer hover:text-gray-600'
        >
          <X size={20} />
        </button>
        <h3 className='text-xl font-semibold mb-4'>Medical Intake Form</h3>
        <p><strong>Name:</strong> {`${selectedPatient.firstName} ${selectedPatient.lastName}`}</p>
        <p><strong>Age:</strong> {selectedPatient.dateOfBirth}</p>
        <p><strong>Gender:</strong> {selectedPatient.gender}</p>
        <p><strong>Last Appointment:</strong> {new Date(selectedPatient.lastAppointmentDate).toLocaleDateString()}</p>
        <div className='mt-4'>
          <IntakeForm patientId={selectedPatient._id} />
        </div>
      </div>
    </div>
  )
}

export default Modal;