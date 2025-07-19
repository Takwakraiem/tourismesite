const API_URL = "http://localhost:3500/api/guides";
export const getAllGuides = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Erreur chargement guides");
  return res.json();
};
export const getAllGuidesbyCountryId = async (id:string) => {
  const res = await fetch(`${API_URL}/country/${id}`);
  if (!res.ok) throw new Error("Erreur chargement guides");
  return res.json();
};
export async function createGuide(data: FormData | any, isMultipart = false) {
  const res = await fetch("http://localhost:3500/api/addguides", {
    method: "POST",
    headers: isMultipart ? undefined : { "Content-Type": "application/json" },
    body: isMultipart ? data : JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur lors de la création du guide");
  return res.json();
}

export async function updateGuide(id: string, data: FormData | any, isMultipart = false) {
  const res = await fetch(`http://localhost:3500/api/guides/${id}`, {
    method: "PUT",
    headers: isMultipart ? undefined : { "Content-Type": "application/json" },
    body: isMultipart ? data : JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur lors de la mise à jour du guide");
  return res.json();
}


export const deleteGuide = async (id: string) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erreur suppression");
  return res.json();
};

export const toggleGuideStatus = async (id: string) => {
  const res = await fetch(`${API_URL}/${id}/status`, { method: "PATCH" });
  if (!res.ok) throw new Error("Erreur changement statut");
  return res.json();
};
