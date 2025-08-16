import { Image } from './image';

export interface Album {
  id: string;
  images: Image[];
  name: string;
}
