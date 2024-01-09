'use client'

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './../firebase';

import Header from './../components/header';
import Preferences from './../components/preferences';
import PersonalDetails from './../components/personalDetails';
import { NextPage } from 'next';
import { Snackbar } from '@mui/material';


const Account = () => {
  const uid = auth.currentUser?.uid;
  const [currentTab, setCurrentTab] = useState('account');
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [name, setName] = useState('');

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleUpdateDetails = async () => {
    if (uid) {
      const userDocRef = doc(db, 'users', uid);

      try {
        await updateDoc(userDocRef, { name });
        setError('User details updated successfully');
        setSnackbarOpen(true);
      } catch (error) {
        setError('Error updating user details: ' + error.message);
        setSnackbarOpen(true);
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (uid) {
        const userDocRef = doc(db, 'users', uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setName(userData.name || '');
        }
      }
    };
    fetchUserData();
  }, [uid]);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <Header />
      <section className="mt-8 sticky top-0 z-50">
        <div className="flex mb-8">
          <button
            className={`pl-9 pr-9 text-center font-semibold rounded-tl-lg rounded-bl-lg ${
              currentTab === 'account' ? 'bg-blue-500 text-white' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentTab('account')}
          >
            Account Details
          </button>
          <button
            className={`pl-9 pr-9 text-center font-semibold ${
              currentTab === 'personal' ? 'bg-blue-500 text-white' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentTab('personal')}
          >
            Personal Details
          </button>
          <button
            className={`pl-9 pr-9 p-3 text-center font-semibold rounded-tr-lg rounded-br-lg ${
              currentTab === 'preferences' ? 'bg-blue-500 text-white' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentTab('preferences')}
          >
            Preferences
          </button>
        </div>

        {currentTab === 'account' && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-white">Account Details</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2 font-semibold text-white">
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            {/* ... (other form fields) */}
            <button type="button" onClick={handleUpdateDetails} className="bg-blue-500 text-white p-2 rounded">
              Change Details
            </button>
          </form>
        </div>
      )}

        {currentTab === 'personal' && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Personal Details</h2>
            <form>
              <PersonalDetails />
            </form>
          </div>
        )}

        {currentTab === 'preferences' && (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-3">Preferences</h2>
            <form>
              <Preferences />
            </form>
          </div>
        )}
      </section>
      {/* Snackbar for displaying errors */}
      <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={error || ''}
      />
    </main>
  );
};

export default Account;
