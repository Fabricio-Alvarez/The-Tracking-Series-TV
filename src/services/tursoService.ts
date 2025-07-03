// src/services/tursoService.ts

const API_BASE = 'http://localhost:3001/api';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface UserShow {
  id: string;
  userId: string;
  showId: string;
  type: 'watchlist' | 'watched' | 'favorites' | 'watching';
  addedAt: string;
}

class TursoService {
  
  async createUser(email: string, name: string): Promise<User> {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    });
    if (!res.ok) throw new Error('Error creando usuario');
    return await res.json();
  }

  
  async getUserByEmail(email: string): Promise<User | null> {
    const res = await fetch(`${API_BASE}/users/${encodeURIComponent(email)}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Error obteniendo usuario');
    return await res.json();
  }

  
  async addUserShow(userId: string, showId: string, type: UserShow['type'], mediaType: 'series' | 'movie' = 'series'): Promise<void> {
    const res = await fetch(`${API_BASE}/user-shows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, showId, type, mediaType }),
    });
    if (!res.ok) throw new Error('Error agregando show');
  }

 
  async removeUserShow(userId: string, showId: string, type: UserShow['type']): Promise<void> {
    const res = await fetch(`${API_BASE}/user-shows`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, showId, type }),
    });
    if (!res.ok) throw new Error('Error removiendo show');
  }

  
  async getUserShows(userId: string, type?: UserShow['type']): Promise<UserShow[]> {
    let url = `${API_BASE}/user-shows/${userId}`;
    if (type) url += `/${type}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error obteniendo shows');
    const data = await res.json();
   
    return data.map((us: any) => ({
      id: us.id,
      userId: us.user_id,
      showId: us.show_id,
      type: us.type,
      mediaType: us.media_type || 'series',
      addedAt: us.added_at,
    }));
  }

  
  async isUserShow(userId: string, showId: string, type: UserShow['type']): Promise<boolean> {
    const res = await fetch(`${API_BASE}/user-shows/${userId}/${showId}/${type}`);
    if (!res.ok) throw new Error('Error verificando show');
    const data = await res.json();
    return data.isInList;
  }
}

export default new TursoService();