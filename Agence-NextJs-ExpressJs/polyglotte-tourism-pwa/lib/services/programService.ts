const API_URL = "http://localhost:3500/api/program";

export const getAllPrograms = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Échec de chargement des programmes");
  return res.json();
};
export const getAllProgramsbyId = async (id: string) => {
  const res = await fetch(`${API_URL}/country/${id}`);
  if (!res.ok) throw new Error("Échec de chargement des programmes");
  return res.json();
};
export const getProgramById = async (id: string) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Programme introuvable");
  return res.json();
};

export const createProgram = async (data: any) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur lors de la création");
  return res.json();
};

export const updateProgram = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur lors de la mise à jour");
  return res.json();
};

export const deleteProgram = async (id: string, token?: string) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression");
  return res.json();
};

export const updateStatus = async (id: string, status: string) => {
  const res = await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Erreur mise à jour du statut");
  return res.json();
};

export const incrementViews = async (id: string) => {
  const res = await fetch(`${API_URL}/${id}/view`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Erreur d'incrémentation des vues");
  return res.json();
};

export const addLike = async (id: string) => {
  const res = await fetch(`${API_URL}/${id}/like`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Erreur ajout like");
  return res.json();
};

export const removeLike = async (id: string) => {
  const res = await fetch(`${API_URL}/${id}/like`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erreur suppression like");
  return res.json();
};

export const addComment = async (id: string, comment: string) => {
  const res = await fetch(`${API_URL}/${id}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ comment }),
  });
  if (!res.ok) throw new Error("Erreur ajout commentaire");
  return res.json();
};

export const removeComment = async (id: string, commentId: string) => {
  const res = await fetch(`${API_URL}/${id}/comment/${commentId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erreur suppression commentaire");
  return res.json();
};

export const searchPrograms = async (query: string) => {
  const res = await fetch(`${API_URL}/search?q=${query}`);
  if (!res.ok) throw new Error("Erreur recherche programme");
  return res.json();
};

export const getProgramsByCountry = async (countryId: string) => {
  const res = await fetch(`${API_URL}/country/${countryId}`);
  if (!res.ok) throw new Error("Erreur programmes par pays");
  return res.json();
};
