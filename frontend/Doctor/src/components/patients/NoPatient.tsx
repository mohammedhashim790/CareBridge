import { UserX } from 'lucide-react';

function NoPatient() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <UserX size={48} className="mb-4" />
      <h3 className="text-lg font-semibold">No patients found</h3>
      <p className="text-sm text-gray-400 mt-2">There is no patient history yet.</p>
    </div>
  );
}

export default NoPatient;
