'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { getAllGuides } from '@/lib/services/guideService';
import { getAllPrograms } from '@/lib/services/programService';
import { Card } from '@/components/ui/card'; // assure-toi qu’il est bien exporté ici

const API_URL = 'http://localhost:3500/api/ProgramGuide';

export default function ProgramGuidePage() {
  const [programGuides, setProgramGuides] = useState<any[]>([]);
  const [newGuide, setNewGuide] = useState({ programId: '', guideId: '' });
  const [programs, setPrograms] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]);

  useEffect(() => {
    axios.get(API_URL)
      .then(res => setProgramGuides(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const programsData = await getAllPrograms();
        const guidesData = await getAllGuides();
        setPrograms(programsData);
        setGuides(guidesData);
      } catch (err) {
        console.error('Erreur lors du chargement des données :', err);
      }
    };

    fetchData();
  }, []);

  const handleCreate = async () => {
    try {
      const res = await axios.post(API_URL, newGuide);
        axios.get(API_URL)
      .then(res => setProgramGuides(res.data))
      .catch(err => console.error(err));
      setNewGuide({ programId: '', guideId: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProgramGuides(programGuides.filter(pg => pg._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Liaison Programmes / Guides</h1>

      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="flex flex-col">
          <label className="font-medium mb-1">Programme</label>
          <select
            value={newGuide.programId}
            onChange={(e) => setNewGuide({ ...newGuide, programId: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- Sélectionner un programme --</option>
            {programs.map((program) => (
              <option key={program._id} value={program._id}>
                {program.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1">Guide</label>
          <select
            value={newGuide.guideId}
            onChange={(e) => setNewGuide({ ...newGuide, guideId: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- Sélectionner un guide --</option>
            {guides.map((guide) => (
              <option key={guide._id} value={guide._id}>
                {guide.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Créer
        </button>
      </div>

      <div className="grid gap-4">
        {programGuides.map((pg) => (
          <Card key={pg._id} className="p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="font-semibold">
                {pg.programId?.title || 'Programme inconnu'} ↔ {pg.guideId?.name || 'Guide inconnu'}
              </p>
            </div>
            <button
              onClick={() => handleDelete(pg._id)}
              className="text-red-600 hover:underline text-sm"
            >
              Supprimer
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
