import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TriWebSocketService {
  private socket: WebSocket | null = null;
  private itemsSubject = new BehaviorSubject<string[]>([]);

  public items$ = this.itemsSubject.asObservable();

  connectToSortingWebSocket() {
    const wsUrl = 'ws://127.0.0.1:8000/ws/start-sorting'; // 'ws://192.168.43.166:8000/ws/start-sorting'
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connecté pour le tri');
    };

    this.socket.onmessage = (event) => {
      const newItem = event.data;
      const currentItems = this.itemsSubject.value;
      this.itemsSubject.next([...currentItems, newItem]);
      console.log('Nouvel item reçu:', newItem);
    };

    this.socket.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
    };

    this.socket.onclose = () => {
      console.log('WebSocket déconnecté');
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  // Cette méthode est à appeler quand le tri commence
  startTri() {
    this.connectToSortingWebSocket();
  }

  // Cette méthode est à appeler quand le tri se termine
  endTri() {
    this.disconnect();
  }
}
