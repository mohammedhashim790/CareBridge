import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useMyIntakeForm, useDeleteIntakeForm } from '../../hooks/useMyIntakeForm';

const ViewIntakeForm = () => {
  const navigate = useNavigate();
  
  const buttonStyle = 'px-4 py-2 bg-primary text-white hover:bg-hover hover:cursor-pointer';
  
  const { data, isLoading, isError } = useMyIntakeForm();
  
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);
  
  const { mutate: deleteForm } = useDeleteIntakeForm();
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this form?')) {
      deleteForm();
    }
  };
  
  if (isLoading) return <div className="text-center mt-6">Loading...</div>;
  
  // Format medications from data
  const medications = data?.medications?.map((med) => ({
    ...med,
    startDate: med.startDate?.slice(0, 10),
    endDate: med.endDate?.slice(0, 10),
  })) || [];
  
  if (medications.length === 0 || isError) {
    return (
      <div className='flex flex-col items-center'>
        <h1 className="text-2xl font-bold my-4">View My Intake Form</h1>
        <div className='flex flex-col items-center gap-y-4'>
          <p>No medications listed.</p>
          <button className={buttonStyle} onClick={() => navigate('/a/intakeForm/create')}>
            Create New Intake Form
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-stretch max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">View My Intake Form</h1>
      
      {medications.map((med, index) => (
        <div key={index} className="border rounded p-4 space-y-4 bg-gray-50 mb-4">
          <p><strong>Name:</strong> {med.name}</p>
          <p><strong>Dosage:</strong> {med.dosage}</p>
          <p><strong>Frequency:</strong> {med.frequency}</p>
          <p><strong>Start Date:</strong> {med.startDate}</p>
          <p><strong>Still Taking:</strong> {med.stillTaking ? 'Yes' : 'No'}</p>
          {!med.stillTaking && <p><strong>End Date:</strong> {med.endDate}</p>}
        </div>
      ))}
      
      <div className='flex self-end gap-4'>
        <button className={buttonStyle} onClick={() => navigate('/a/intakeForm/update')}>
          Edit
        </button>
        <button className={buttonStyle} onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ViewIntakeForm;