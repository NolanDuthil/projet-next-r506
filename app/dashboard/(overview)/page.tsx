"use client"
import { useEffect, useState } from 'react';

export default function Gestion() {
    const [intervenants, setIntervenants] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('/api/intervenants/get');
            const result = await response.json();
            setIntervenants(result);
            console.log(intervenants);
        };

        fetchData();
    }, []);

    return (
        <main className="flex min-h-screen flex-col p-6">
            <h1>Gestion des Intervenants :</h1>
            {intervenants ? (
                <>
                    <ul>
                        {intervenants.map((intervenant) => (
                            <li className='flex justify-between' key={intervenant.id}>- {intervenant.firstname} {intervenant.name} {intervenant.email} {intervenant.key} {intervenant.creationdate} {intervenant.enddate} {intervenant.availability}</li>
                        ))}
                    </ul>
                </>
            ) : (
                <>
                    <p>Loading...</p>
                </>
            )}
        </main>
    );
}