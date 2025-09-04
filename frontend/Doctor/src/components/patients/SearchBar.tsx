import { Search } from 'lucide-react';

type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

function SearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
  return (
    <div className='flex items-center gap-2 px-3 py-2 border border-gray-300 rounded w-full sm:w-2/3 bg-white'>
      <Search size={16} className='text-gray-500' />
      <input
        type='text'
        placeholder='Search by name...'
        className='w-full outline-none bg-transparent'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;