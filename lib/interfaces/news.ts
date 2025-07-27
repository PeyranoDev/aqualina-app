/**
 * Representa una noticia o comunicado.
 * Corresponde a la entidad `News` del backend.
 */
export interface News {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string; 
}