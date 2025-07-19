// lib/api.js
const API_BASE = 'http://localhost:3500/api'; // mettez l'URL de votre backend Express ici

export async function fetchProgramGuides() {
  const res = await fetch(`${API_BASE}/ProgramGuide`);
  if (!res.ok) throw new Error('Erreur lors de la récupération des guides');
  return res.json();
}

export async function fetchProgramGuideById(id:any) {
  const res = await fetch(`${API_BASE}/ProgramGuide/${id}`);
  if (!res.ok) throw new Error('Guide non trouvé');
  return res.json();
}

export async function createProgramGuide(data:any) {
  const res = await fetch(`${API_BASE}/ProgramGuide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Erreur lors de la création');
  return res.json();
}

export async function deleteProgramGuide(id:any) {
  const res = await fetch(`${API_BASE}/ProgramGuide/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erreur lors de la suppression');
  return res.json();
}
