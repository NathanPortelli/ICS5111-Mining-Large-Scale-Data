import { FC, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

import { Snackbar } from '@mui/material';

const PreferenceAllegries: FC = () => {
  const { register } = useForm();
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [temporaryPreferences, setTemporaryPreferences] = useState<string[]>([]);
  const [showSelectedPreferences, setShowSelectedPreferences] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handlePreferenceChange = (preference: string) => {
    setTemporaryPreferences((prevTemporaryPreferences) => {
      if (prevTemporaryPreferences.includes(preference)) {
        return prevTemporaryPreferences.filter((pref) => pref !== preference);
      } else {
        return [...prevTemporaryPreferences, preference];
      }
    });
  };

  const handleChangePreferences = async () => {
    try {
      const uid = auth.currentUser?.uid;

      if (uid) {
        const userDocRef = doc(db, 'users', uid);

        await updateDoc(userDocRef, {
          preferences: temporaryPreferences,
        });

        setSelectedPreferences(temporaryPreferences);
        setShowSelectedPreferences(true);

        setError('User preferences updated.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setError('Error updating preferences:' + error.message);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const uid = auth.currentUser?.uid;

        if (uid) {
          const userDocRef = doc(db, 'users', uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const userPreferences = userData?.preferences || [];

            setSelectedPreferences(userPreferences);
            setTemporaryPreferences(userPreferences);
            setShowSelectedPreferences(true);
          }
        }
      } catch (error) {
        setError('Error fetching user preferences:' + error.message);
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPreferences();
  }, []);

  if (loading) {
    return <p className='text-white'>Loading...</p>;
  }

  return (
    <section>
      <div className="bg-white p-6 rounded-md shadow-md">
        <p className="mb-4 font-semibold text-gray-800">Please select your allergies/dietary restrictions:</p>
        <div className="grid grid-cols-2 gap-4 text-gray-800">
          {['Dairy Free', 'Gluten Free', 'Halal', 'Kosher', 'Nut Free', 'Shellfish Free', 'Vegetarian', 'Vegan'].map((preference) => (
            <label key={preference} className="flex items-center">
              <input
                type="checkbox"
                {...register(preference)}
                className="mr-2 border-gray-400 focus:outline-none focus:border-blue-500"
                onChange={() => handlePreferenceChange(preference)}
                checked={temporaryPreferences.includes(preference)}
              />
              {preference}
            </label>
          ))}
        </div>
        {showSelectedPreferences && (
          <p className="mt-4 text-gray-800">
            <b>Selected:</b><br /> {selectedPreferences.join(', ')}
          </p>
        )}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleChangePreferences}
            className="w-full px-4 py-2 bg-gray-400 text-white rounded-md transition duration-300 hover:bg-gray-500"
          >
            Change Restrictions
          </button>
        </div>
        <p className='text-sm pt-5 font-semibold'>
          Please note that this section is not yet functional, and will therefore not impact the generated meal plan!
        </p>
      </div>
      {/* Snackbar for displaying errors */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={error || ''}
      />
    </section>
  );
};

export default PreferenceAllegries;
