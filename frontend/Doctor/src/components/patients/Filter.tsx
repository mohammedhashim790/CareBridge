import { Filter as LucideFilter } from 'lucide-react';
import type { GenderType } from '../../types/patients/gender';

type FilterProps = {
    genderFilter: GenderType;
    setGenderFilter: (value: GenderType) => void;
};

function Filter({ genderFilter, setGenderFilter }: FilterProps) {
  return (
    <div className='flex items-center gap-2 px-3 py-2 border border-gray-300 rounded w-full sm:w-1/3 bg-white'>
      <LucideFilter size={16} className='text-gray-500' />
      <select
        value={genderFilter}
        onChange={(e) => setGenderFilter(e.target.value as GenderType)}
        className='w-full bg-transparent outline-none'
      >
        <option value='All'>All Genders</option>
        <option value='Male'>Male</option>
        <option value='Female'>Female</option>
        <option value='Other'>Other</option>
      </select>
    </div>
  );
}

export default Filter;