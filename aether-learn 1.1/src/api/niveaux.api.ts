import { api } from './axios';
import { Niveau } from '@/types/niveau.types';

export const getNiveaux = async (): Promise<Niveau[]> => {
  const response = await api.get('/niveaux');
  return response.data.data;
};
