import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { doc, getDoc, updateDoc, collection, setDoc } from 'firebase/firestore';
import { auth, db } from './../firebase';

import { Snackbar } from '@mui/material';

const PersonalDetails: FC = () => {
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const uid = auth.currentUser?.uid;
    const { register, setValue, handleSubmit } = useForm();
    const [error, setError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        // Function to fetch user data from Firebase
        const fetchUserData = async () => {
            try {
                const uid = auth.currentUser?.uid;
                if (uid) {
                    const userDocRef = doc(db, 'users', uid);
                    const userDocSnapshot = await getDoc(userDocRef);

                    if (userDocSnapshot.exists()) {
                        const userData = userDocSnapshot.data();
                        setValue('gender', userData?.gender || '');
                        setValue('age', userData?.age || '');
                        setValue('height', userData?.height || '');
                        setValue('weight', userData?.weight || '');
                    }                
                }
            } catch (error) {
            console.error('Error fetching user data:', error);
            }
        };
        // Call the fetchUserData function when the component mounts
        fetchUserData();
    }, [setValue]);

    const onSubmit = async (data: any) => {
        try {
            const uid = auth.currentUser?.uid;
            if (uid) {
                const userDocRef = doc(db, 'users', uid);
                try {
                    await updateDoc(userDocRef, {
                        gender: data.gender,
                        age: data.age,
                        height: data.height,
                        weight: data.weight,
                    });
                    setError('User details updated successfully');
                    setSnackbarOpen(true);
                } catch (error) {
                    setError('Error updating user details: ' + error.message);
                    setSnackbarOpen(true);
                }
            }
            setError('User data updated successfully.');
            setSnackbarOpen(true);
        } catch (error) {
            setError('Error updating user data: ' + error.message);
            setSnackbarOpen(true);
        }
    };  

    return (
        <section className="gap-8">
            {/* Personal Details Section */}
            <form className="gap-8" onSubmit={handleSubmit(onSubmit)}>
                <div className="">
                    <div className="mb-6">
                    <label htmlFor="gender" className="block mb-2 font-semibold text-white">
                        Gender:
                    </label>
                    <select id="gender" {...register('gender')} className="w-full p-2 border rounded">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    </div>

                    <div className="mb-6">
                    <label htmlFor="age" className="block mb-2 font-semibold text-white">
                        Age:
                    </label>
                    <input
                        type="number"
                        id="age"
                        {...register('age', { valueAsNumber: true })}
                        className="w-full p-2 border rounded"
                    />
                    </div>

                    <div className="mb-6">
                    <label htmlFor="height" className="block mb-2 font-semibold text-white">
                        Height (cm):
                    </label>
                    <input
                        type="number"
                        id="height"
                        {...register('height', { valueAsNumber: true })}
                        className="w-full p-2 border rounded"
                    />
                    </div>

                    <div className="mb-6">
                    <label htmlFor="weight" className="block mb-2 font-semibold text-white">
                        Weight (kg):
                    </label>
                    <input
                        type="number"
                        id="weight"
                        {...register('weight', { valueAsNumber: true })}
                        className="w-full p-2 border rounded"
                    />
                    </div>
                    <div className="mb-6">
                        <button type="button" onClick={handleSubmit(onSubmit)} className="bg-blue-500 text-white p-2 rounded">
                            Change Details
                        </button>
                    </div>
                </div>
                {/* Snackbar for displaying errors */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                    message={error || ''}
                />
            </form>
        </section>
    );
};

export default PersonalDetails;
