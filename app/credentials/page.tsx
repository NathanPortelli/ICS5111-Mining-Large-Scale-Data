'use client'

import { useRouter } from 'next/navigation'

import { useState } from 'react';
import { Snackbar } from '@mui/material';

import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { auth, db } from './../firebase';

const Credentials = () => {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleSignIn = async () => {
        try {
        await signInWithEmailAndPassword(auth, email, password);
        setError('Sign in successful!');
        setSnackbarOpen(true);
        router.push('/'); 
        } catch (error) {
        setError(error.message);
        setSnackbarOpen(true);
        }
    };

    const handleRegister = async () => {
        try {
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setSnackbarOpen(true);
            return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Reference to the 'users' collection
        const usersCollection = collection(db, 'users');
        // Create a new document in the 'users' collection
        const userDoc = doc(usersCollection, userCredential.user.uid);
        // Set user details in the document
        await setDoc(userDoc, {
          admin: false,
          age: 0,
          email,
          name,
          gender: 0,
          height: 0,
          weight: 0,
        });
  
        setError('Registration successful!');
        setSnackbarOpen(true);
        router.push('/'); 
        } catch (error) {
        setError(error.message);
        setSnackbarOpen(true);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <section className="mt-8 mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-white">{isRegistering ? 'Register' : 'Sign In'}</h2>
                <form>
                    <div className="mb-6">
                        <div className="grid">
                            {isRegistering && (
                            <>
                                <label className="block mb-2 font-semibold text-white mt-4">Name:</label>
                                <input type="name" onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" required />
                            </>
                            )}                            

                            <label className="block mb-2 font-semibold text-white mt-4">Email:</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" required />

                            <label className="block mb-2 font-semibold mt-4 text-white">Password:</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" required />

                            {isRegistering && (
                            <>
                                <label className="block mb-2 font-semibold mt-4 text-white">Confirm Password:</label>
                                <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full p-2 border rounded"
                                />
                            </>
                            )}

                            <button type="button" onClick={isRegistering ? handleRegister : handleSignIn} className="text-white w-full p-2 mt-4 mb-4 bg-blue-500 text-white rounded transition duration-300 hover:bg-blue-600">
                                {isRegistering ? 'Register' : 'Sign In'}
                            </button>

                            <p className="text-white cursor-pointer hover:underline" onClick={() => setIsRegistering(!isRegistering)}>
                                {isRegistering ? 'Already have an account? Sign In' : 'Don\'t have an account? Register'}
                            </p>
                        </div>
                    </div>
                </form>
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

export default Credentials;
