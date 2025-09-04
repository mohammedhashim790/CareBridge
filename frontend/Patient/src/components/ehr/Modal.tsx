import { useState } from 'react';
import { X } from 'lucide-react';
import type { Sleep, BloodCount, HealthRecordsPostData } from 'shared-modules/src/types/health-records';
import { useCreateHealthRecords } from '../../hooks/useHealthRecords'; // assume this exists

type ModalProps = {
  closeModal: () => void;
};

function Modal({ closeModal }: ModalProps) {
  const [steps, setSteps] = useState<number>(0);
  const [operations, setOperations] = useState<number>(0);
  const [sleep, setSleep] = useState<Sleep>({ hours: 0, minutes: 0 });
  const [bloodCount, setBloodCount] = useState<BloodCount>({ redBloodCells: 0, whiteBloodCells: 0});
  const [includeBlood, setIncludeBlood] = useState(false);

  const { mutate: createRecord } = useCreateHealthRecords();

  // Function to select all text when input is focused (mobile-safe)
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Use setTimeout to avoid mobile context menu issues
    setTimeout(() => {
      e.target.select();
    }, 10);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if(!steps || !operations || !sleep.hours || !sleep.minutes) {
      alert('Missing values. Please answer all the required inputs.');
      return;
    }

    if (!confirm('This data can be saved only once a day and cannot be changed. Do you want to continue?'))
        return;

    const payload: HealthRecordsPostData = {
      steps,
      operations,
      sleep,
      ...(includeBlood ? { bloodCount } : {}),
    };

    createRecord(payload);
    closeModal();
  };

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-8 max-w-md w-full shadow-lg relative'>
        <button
          onClick={closeModal}
          className='absolute top-2 right-2 text-gray-400 cursor-pointer hover:text-gray-600'
        >
          <X size={20} />
        </button>

        <h3 className='text-xl font-semibold mb-4'>Log Health Data</h3>
        <form onSubmit={handleSubmit} className='space-y-4'>

          {/* Steps */}
          <div>
            <label className='block font-medium'>Steps*</label>
            <input
              type='number'
              value={steps}
              onChange={(e) => setSteps(Number(e.target.value))}
              min={0}
              onFocus={handleFocus}
              required
              className='w-full border px-3 py-2 rounded'
            />
          </div>

          {/* Operations */}
          <div>
            <label className='block font-medium'>Operations*</label>
            <input
              type='number'
              value={operations}
              onChange={(e) => setOperations(Number(e.target.value))}
              min={0}
              onFocus={handleFocus}
              required
              className='w-full border px-3 py-2 rounded'
            />
          </div>

          {/* Sleep */}
          <p className='block font-medium m-0'>Sleep*</p>
          <div className='flex gap-2'>
            <div className='flex-1'>
              <label>Hours</label>
              <input
                type='number'
                value={sleep.hours}
                onChange={(e) => setSleep({ ...sleep, hours: Number(e.target.value) })}
                min={0}
                max={23}
                onFocus={handleFocus}
                className='w-full border px-3 py-2 rounded'
              />
            </div>
            <div className='flex-1'>
              <label>Minutes</label>
              <input
                type='number'
                value={sleep.minutes}
                onChange={(e) => setSleep({ ...sleep, minutes: Number(e.target.value) })}
                min={0}
                max={60}
                onFocus={handleFocus}
                className='w-full border px-3 py-2 rounded'
              />
            </div>
          </div>

          {/* Optional Blood Info */}
          <div>
            <label className='inline-flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                checked={includeBlood}
                onChange={(e) => setIncludeBlood(e.target.checked)}
              />
              Include Blood Count
            </label>

            {includeBlood && (
              <div className='mt-2 space-y-2'>
                <div>
                  <label className='block'>Red Blood Cells</label>
                  <input
                    type='number'
                    value={bloodCount.redBloodCells ?? ''}
                    onChange={(e) =>
                      setBloodCount({ ...bloodCount, redBloodCells: Number(e.target.value) })
                    }
                    min={0}
                    onFocus={handleFocus}
                    className='w-full border px-3 py-2 rounded'
                  />
                </div>
                <div>
                  <label className='block'>White Blood Cells</label>
                  <input
                    type='number'
                    value={bloodCount.whiteBloodCells ?? ''}
                    onChange={(e) =>
                      setBloodCount({ ...bloodCount, whiteBloodCells: Number(e.target.value) })
                    }
                    min={0}
                    onFocus={handleFocus}
                    className='w-full border px-3 py-2 rounded'
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type='submit'
            className='w-full bg-primary text-white py-2 rounded cursor-pointer hover:bg-hover'
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Modal;