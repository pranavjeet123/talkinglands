import { BehaviorSubject, Subject } from 'rxjs';
import { Feature } from './types';

export interface MicrofrontendMessage {
  type: string;
  payload: unknown;
  source: string;
  timestamp: number;
}

// Global window interface extension
declare global {
  interface Window {
    __MICROFRONTEND_COMMUNICATION__?: MicrofrontendCommunicationService;
  }
}

class MicrofrontendCommunicationService {
  private static instance: MicrofrontendCommunicationService;
  
  // Global message bus for any communication
  private globalMessageSubject = new Subject<MicrofrontendMessage>();
  
  // Specific streams for different types of data
  private favoriteCandidatesSubject = new BehaviorSubject<Feature[]>([]);
  private selectedCandidateSubject = new BehaviorSubject<Feature | null>(null);
  
  private constructor() {
    // Make the service available globally for microfrontends
    if (typeof window !== 'undefined') {
      window.__MICROFRONTEND_COMMUNICATION__ = this;
    }
  }
  
  static getInstance(): MicrofrontendCommunicationService {
    if (!MicrofrontendCommunicationService.instance) {
      MicrofrontendCommunicationService.instance = new MicrofrontendCommunicationService();
    }
    return MicrofrontendCommunicationService.instance;
  }
  
  // Global message bus methods
  sendMessage(type: string, payload: unknown, source: string) {
    const message: MicrofrontendMessage = {
      type,
      payload,
      source,
      timestamp: Date.now()
    };
    this.globalMessageSubject.next(message);
  }
  
  get messages$() {
    return this.globalMessageSubject.asObservable();
  }
  
  // Favorite candidates methods
  addFavoriteCandidate(candidate: Feature, source = 'unknown') {
    const currentFavorites = this.favoriteCandidatesSubject.value;
    const isAlreadyFavorite = currentFavorites.some(fav => fav.properties.id === candidate.properties.id);
    
    if (!isAlreadyFavorite) {
      const newFavorites = [...currentFavorites, candidate];
      this.favoriteCandidatesSubject.next(newFavorites);
      this.sendMessage('FAVORITE_ADDED', candidate, source);
    }
  }
  
  removeFavoriteCandidate(candidateId: string, source = 'unknown') {
    const currentFavorites = this.favoriteCandidatesSubject.value;
    const newFavorites = currentFavorites.filter(fav => fav.properties.id !== candidateId);
    this.favoriteCandidatesSubject.next(newFavorites);
    this.sendMessage('FAVORITE_REMOVED', { candidateId }, source);
  }
  
  setFavoriteCandidates(candidates: Feature[], source = 'unknown') {
    this.favoriteCandidatesSubject.next(candidates);
    this.sendMessage('FAVORITES_SET', candidates, source);
  }
  
  get favoriteCandidates$() {
    return this.favoriteCandidatesSubject.asObservable();
  }
  
  getFavoriteCandidates(): Feature[] {
    return this.favoriteCandidatesSubject.value;
  }
  
  // Selected candidate methods
  selectCandidate(candidate: Feature | null, source = 'unknown') {
    this.selectedCandidateSubject.next(candidate);
    this.sendMessage('CANDIDATE_SELECTED', candidate, source);
  }
  
  get selectedCandidate$() {
    return this.selectedCandidateSubject.asObservable();
  }
  
  getSelectedCandidate(): Feature | null {
    return this.selectedCandidateSubject.value;
  }
}

// Create and export the singleton instance
export const communicationService = MicrofrontendCommunicationService.getInstance();

// Export helper functions for easier use
export const useCommunication = () => ({
  sendMessage: (type: string, payload: unknown, source: string) => 
    communicationService.sendMessage(type, payload, source),
  
  addFavorite: (candidate: Feature, source?: string) => 
    communicationService.addFavoriteCandidate(candidate, source),
  
  removeFavorite: (candidateId: string, source?: string) => 
    communicationService.removeFavoriteCandidate(candidateId, source),
  
  selectCandidate: (candidate: Feature | null, source?: string) => 
    communicationService.selectCandidate(candidate, source),
  
  // Observables
  messages$: communicationService.messages$,
  favoriteCandidates$: communicationService.favoriteCandidates$,
  selectedCandidate$: communicationService.selectedCandidate$,
  
  // Current values
  getFavorites: () => communicationService.getFavoriteCandidates(),
  getSelected: () => communicationService.getSelectedCandidate(),
});

// Global access helper for microfrontends
export const getCommunicationService = (): MicrofrontendCommunicationService => {
  if (typeof window !== 'undefined' && window.__MICROFRONTEND_COMMUNICATION__) {
    return window.__MICROFRONTEND_COMMUNICATION__;
  }
  return communicationService;
};
