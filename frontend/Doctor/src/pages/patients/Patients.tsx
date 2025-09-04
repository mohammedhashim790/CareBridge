import { useState } from 'react';
import { useMyPatients } from '../../hooks/patients/useMyPatients';
import { User } from 'lucide-react';
import SearchBar from '../../components/patients/SearchBar';
import Filter from '../../components/patients/Filter';
import NoPatient from '../../components/patients/NoPatient';
import PatientList from '../../components/patients/PatientList';
import Modal from '../../components/patients/Modal';

import type { GenderType } from '../../types/patients/gender';
import type { MyPatient } from '../../types/patients/patient';

function Patients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<GenderType>('All');
  const [selectedPatient, setSelectedPatient] = useState<MyPatient | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data: patients, isLoading, isError, error } = useMyPatients();

  const filteredPatients = (patients ?? [])
  .filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`;
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = genderFilter === 'All' || patient.gender === genderFilter;
    return matchesSearch && matchesGender;
  })
  .sort((a, b) => new Date(b.lastAppointmentDate).getTime() - new Date(a.lastAppointmentDate).getTime());

  const openModal = (patient: MyPatient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPatient(null);
    setShowModal(false);
  };

  if (isLoading) return <p>Loading patients...</p>;
  if (isError) return <p>Error loading patients: {(error as Error).message}</p>;

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-semibold flex items-center gap-2'>
          <User size={20} />
          Patients
        </h2>
      </div>

      {/* Search & Filter */}
      <div className='flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mb-6'>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Filter genderFilter={genderFilter} setGenderFilter={setGenderFilter} />
      </div>

      {/* Patient List */}
      { filteredPatients.length === 0 ? 
        <NoPatient /> :
        <PatientList patients={filteredPatients} openModal={openModal} />
      }

      {/* Modal */}
      {showModal && selectedPatient && <Modal closeModal={closeModal} selectedPatient={selectedPatient} />}
    </div>
  );
};

export default Patients;