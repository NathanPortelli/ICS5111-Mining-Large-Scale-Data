import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './../firebase';

import { Snackbar } from '@mui/material';

// todo: Issue -- On refresh data does not appear

const PersonalDetails: FC = () => {
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const uid = auth.currentUser?.uid;
    const { register, handleSubmit, setValue, control } = useForm({
        defaultValues: {
            gender: '',
            age: 0,
            height: 0,
            weight: 0,
            bmi: 0,
        },
    });
    const [error, setError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [bmi, setBMI] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                        setBMI(userData?.bmi || null);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [setValue]);

    const getWeightStatus = (bmi: number | null) => {
        if (bmi === null) return "";

        if (bmi < 18.5) {
            return "Underweight";
        } else if (bmi >= 18.5 && bmi < 25.0) {
            return "Healthy Weight";
        } else if (bmi >= 25.0 && bmi < 30.0) {
            return "Overweight";
        } else {
            return "Obesity";
        }
    };

    const onSubmit = async (data: any) => {
        try {
            const uid = auth.currentUser?.uid;
            if (uid) {
                const userDocRef = doc(db, 'users', uid);

                try {
                    // Calculate BMI
                    const heightInMeters = data.height / 100;
                    const bmiValue = data.weight / (heightInMeters * heightInMeters);

                    // Update user details and BMI in FireStore
                    await updateDoc(userDocRef, {
                        gender: data.gender,
                        age: data.age,
                        height: data.height,
                        weight: data.weight,
                        bmi: bmiValue, // Add BMI as a field
                    });

                    setBMI(bmiValue);

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

    // Function to apply color based on weight status
    const getWeightStatusColor = (bmi: number | null) => {
        if (bmi === null) return "";
        if (bmi < 18.5) {
        return "text-blue-500"; // You can replace this with your preferred color
        } else if (bmi >= 18.5 && bmi < 25.0) {
        return "text-green-500";
        } else if (bmi >= 25.0 && bmi < 30.0) {
        return "text-yellow-500";
        } else {
        return "text-red-500";
        }
    };
    
    const calculateBMI = (formData: any) => {
        const heightInMeters = formData.height / 100;
        const bmiValue = formData.weight / (heightInMeters * heightInMeters);
        setBMI(bmiValue);
    };

    if (loading) {
        return <p className='text-white'>Loading...</p>;
    }

    return (
        <section className="gap-8">
            {/* Personal Details Section */}
            <form className="gap-8 p-6 bg-white rounded-md shadow-md">
                <div className="mb-6">
                <label htmlFor="gender" className="block mb-2 font-semibold text-gray-800">
                    Gender:
                </label>
                <select id="gender" {...register('gender')} className="w-full p-3 border rounded focus:outline-none focus:border-blue-500">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                </div>
                <div className="mb-6">
                <label htmlFor="age" className="block mb-2 font-semibold text-gray-800">
                    Age:
                </label>
                <input
                    type="number"
                    id="age"
                    {...register('age', { valueAsNumber: true })}
                    className="w-full p-3 border rounded focus:outline-none focus:border-blue-500"
                />
                </div>
        
                <div className="mb-6">
                <label htmlFor="height" className="block mb-2 font-semibold text-gray-800">
                    Height (cm):
                </label>
                <input
                    type="number"
                    id="height"
                    {...register('height', { valueAsNumber: true })}
                    className="w-full p-3 border rounded focus:outline-none focus:border-blue-500"
                />
                </div>
        
                <div className="mb-6">
                <label htmlFor="weight" className="block mb-2 font-semibold text-gray-800">
                    Weight (kg):
                </label>
                <input
                    type="number"
                    id="weight"
                    {...register('weight', { valueAsNumber: true })}
                    className="w-full p-3 border rounded focus:outline-none focus:border-blue-500"
                />
                </div>
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">
                        Body Mass Index (BMI)
                    </h3>
                    <p className="text-2xl text-gray-800">{bmi?.toFixed(1)} kg/m<sup>2</sup></p>
                    <p className={`text-gray-800 font-semibold ${getWeightStatusColor(bmi)}`}>
                        {getWeightStatus(bmi)}
                    </p>
                </div>
                <div>
                    <button
                        type="button"
                        onClick={() => {
                            handleSubmit((formData) => {
                            onSubmit(formData);
                            calculateBMI(formData);
                            })();
                        }}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md transition duration-300 hover:bg-blue-600"
                    >
                    Change Details
                    </button>
                </div>
            </form>
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
export default PersonalDetails;

