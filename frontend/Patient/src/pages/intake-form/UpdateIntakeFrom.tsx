import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useMyIntakeForm, useUpdateIntakeForm } from '../../hooks/useMyIntakeForm';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { Medication } from '../../types/intake-form';

const UpdateIntakeForm = () => {
  const navigate = useNavigate();
  const [medications, setMedications] = useState<Medication[]>([]);

  const { data, isLoading, isError, error } = useMyIntakeForm();
  const { mutate: updateForm } = useUpdateIntakeForm({
    onSuccess: () => {
      alert('Medical intake form successfully updated!');
      navigate('/a/intakeForm/view');
    },
  });

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  // Populate form when data is fetched
  useEffect(() => {
    if (data?.medications) {
      const formatted = data.medications.map((med) => ({
        ...med,
        startDate: med.startDate?.slice(0, 10),
        endDate: med.endDate?.slice(0, 10),
      }));
      setMedications(formatted);
    }
  }, [data]);

  const handleMedicationChange = (
    index: number,
    field: keyof Medication,
    value: string | boolean | undefined
  ) => {
    const updated = [...medications];
    updated[index][field] = value as never;
    if (field === 'stillTaking' && value) {
      delete updated[index].endDate;
    }
    setMedications(updated);
  };

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        name: '',
        dosage: '',
        frequency: '',
        startDate: new Date().toISOString().slice(0, 10),
        stillTaking: true,
      },
    ]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm({ medications });
  };

  if (isLoading) return <div className="text-center mt-6">Loading...</div>;
  if (isError) return <div className="text-center mt-6 text-red-500">Error: {(error as Error).message}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Update Medical Intake Form</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {medications.map((med, index) => (
          <div key={index} className="border rounded p-4 space-y-4 bg-gray-50 relative">
            {/* Medication fields in label + input format */}
            <div className="space-y-4">
              {/* Name */}
              <div className="flex flex-col sm:grid sm:grid-cols-2 sm:items-center gap-2">
                <label className="font-medium">Medication Name:</label>
                <input
                  type="text"
                  value={med.name}
                  onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                  className="p-2 border rounded w-full"
                />
              </div>

              {/* Dosage */}
              <div className="flex flex-col sm:grid sm:grid-cols-2 sm:items-center gap-2">
                <label className="font-medium">Dosage:</label>
                <input
                  type="text"
                  value={med.dosage}
                  onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                  className="p-2 border rounded w-full"
                />
              </div>

              {/* Frequency */}
              <div className="flex flex-col sm:grid sm:grid-cols-2 sm:items-center gap-2">
                <label className="font-medium">Frequency:</label>
                <input
                  type="text"
                  value={med.frequency}
                  onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                  className="p-2 border rounded w-full"
                />
              </div>

              {/* Start Date */}
              <div className="flex flex-col sm:grid sm:grid-cols-2 sm:items-center gap-2">
                <label className="font-medium">Start Date:</label>
                <input
                  type="date"
                  value={med.startDate}
                  onChange={(e) => handleMedicationChange(index, 'startDate', e.target.value)}
                  className="p-2 border rounded w-full"
                />
              </div>

              {/* Still Taking & End Date */}
              <div className="flex flex-col sm:grid sm:grid-cols-2 sm:items-center gap-4">
                {/* Subtitle */}
                <label className="font-medium">Still Taking?</label>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  {/* Checkbox */}
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={med.stillTaking}
                      onChange={(e) =>
                        handleMedicationChange(index, 'stillTaking', e.target.checked)
                      }
                    />
                    Yes
                  </label>
                  
                  {/* End Date (shown only if not still taking) */}
                  {!med.stillTaking && (
                    <div className="flex flex-col mt-4 sm:flex-row sm:items-center sm:gap-2 sm:mt-0">
                      <label className="font-medium">End Date:</label>
                      <input
                        type="date"
                        value={med.endDate || ''}
                        onChange={(e) =>
                          handleMedicationChange(index, 'endDate', e.target.value)
                        }
                        className="p-2 border rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Remove button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeMedication(index)}
                className="text-red-500 hover:cursor-pointer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addMedication}
          className="flex items-center gap-2 text-primary font-medium hover:cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" /> Add Medication
        </button>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-hover hover:cursor-pointer"
        >
          Update Form
        </button>
      </form>
    </div>
  );
};

export default UpdateIntakeForm;