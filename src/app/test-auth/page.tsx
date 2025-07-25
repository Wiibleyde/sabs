'use client';

import { useState } from 'react';

export default function TestDashboard() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [pin, setPin] = useState('');

    const handleLogin = async () => {
        const response = await fetch('/api/v1/auth/pin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ pin }),
        });

        if (response.ok) {
            setIsLoggedIn(true);
        } else {
            alert('PIN incorrect');
        }
    };

    if (isLoggedIn) {
        return (
            <div className="min-h-screen bg-green-500 flex items-center justify-center">
                <h1 className="text-white text-4xl">DASHBOARD - CONNECTÉ!</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blue-500 flex items-center justify-center">
            <div className="bg-white p-8 rounded">
                <h1 className="text-2xl mb-4">Test Login</h1>
                <input
                    type="text"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="PIN"
                    className="border p-2 mr-2"
                />
                <button 
                    onClick={handleLogin}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Login
                </button>
            </div>
        </div>
    );
}
