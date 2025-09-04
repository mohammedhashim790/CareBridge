import { useIntakeFormById } from "../../hooks/useIntakeForm";

const IntakeForm = ({ patientId }: { patientId: string }) => {
  const { data, isLoading, isError, error } = useIntakeFormById(patientId);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>

  return (
    <div className="flex flex-col items-stretch max-w-3xl mx-auto p-6">
      {data?.medications.map((med, index) => (
        <div key={index} className="border rounded p-4 space-y-4 bg-gray-50 mb-4">
          <p><strong>Name:</strong> {med.name}</p>
          <p><strong>Dosage:</strong> {med.dosage}</p>
          <p><strong>Frequency:</strong> {med.frequency}</p>
          <p><strong>Start Date:</strong> {med.startDate}</p>
          <p><strong>Still Taking:</strong> {med.stillTaking ? 'Yes' : 'No'}</p>
          {!med.stillTaking && <p><strong>End Date:</strong> {med.endDate}</p>}
        </div>
      ))}
    </div>
  );
}

export default IntakeForm;