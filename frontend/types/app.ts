import type { SpotifyArtist } from './spotify';
import type { TicketmasterEvent } from './ticketmaster';

export interface Concert {
  id: string;
  name: string;
  date: string;
  venue: string;
  city: string;
  state?: string;
  country?: string;
  url?: string;
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };
  image?: string;
  ticketmasterEvent?: TicketmasterEvent; // Full event data if needed
}

export interface ArtistWithConcerts {
  artist: SpotifyArtist;
  concerts: Concert[];
  lastSearched?: Date;
}

export interface SearchFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  location?: {
    city?: string;
    state?: string;
    country?: string;
    radius?: number; // miles
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
}


export interface UserProfile {
  id: string;
  display_name: string;
  images: { url: string }[];
  followers: { total: number };
}