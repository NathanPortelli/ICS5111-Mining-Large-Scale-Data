import { FC, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

import { Snackbar } from '@mui/material';

// No longer in use -- changed with user preferences on type of food 'preferences.tsx'

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
    <section className="mb-8">
      {/* Food Preferences Section */}
      <div className="bg-white p-6 rounded-md shadow-md">
        <p className="mb-4 font-semibold text-gray-800">Please select your preferences/allergies:</p>
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
        <div className="mt-6">
          <button
            type="button"
            onClick={handleChangePreferences}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-600"
          >
            Change Preferences
          </button>
        </div>
        {showSelectedPreferences && (
          <p className="mt-4 text-gray-800">
            <b>Selected Preferences:</b><br /> {selectedPreferences.join(', ')}
          </p>
        )}
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
