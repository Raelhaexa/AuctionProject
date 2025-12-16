import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map();
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect(onConnected) {
    if (this.client && this.connected) {
      if (onConnected) onConnected();
      return;
    }

    const wsUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/ws` : '/ws';
    this.client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: {},
      debug: (str) => {
        // Uncomment for debugging
        // console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.connected = true;
        this.reconnectAttempts = 0;
        if (onConnected) onConnected();
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
      onWebSocketClose: () => {
        this.connected = false;
        this.reconnectAttempts++;
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error('Max reconnection attempts reached');
        }
      }
    });

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();
      this.client.deactivate();
      this.connected = false;
    }
  }

  subscribe(topic, callback) {
    if (!this.client || !this.connected) {
      console.warn('WebSocket not connected. Attempting to connect...');
      this.connect(() => this.subscribe(topic, callback));
      return null;
    }

    const subscription = this.client.subscribe(topic, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    this.subscriptions.set(topic, subscription);
    return subscription;
  }

  unsubscribe(topic) {
    const subscription = this.subscriptions.get(topic);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(topic);
    }
  }

  // Subscribe to all auctions updates
  subscribeToAuctions(callback) {
    return this.subscribe('/topic/auctions', callback);
  }

  // Subscribe to auction updates
  subscribeToAuctionUpdates(callback) {
    return this.subscribe('/topic/auctions/update', callback);
  }

  // Subscribe to auction deletes
  subscribeToAuctionDeletes(callback) {
    return this.subscribe('/topic/auctions/delete', callback);
  }

  // Subscribe to specific auction
  subscribeToAuction(auctionId, callback) {
    return this.subscribe(`/topic/auction/${auctionId}`, callback);
  }

  // Subscribe to auction bids
  subscribeToAuctionBids(auctionId, callback) {
    return this.subscribe(`/topic/auction/${auctionId}/bids`, callback);
  }

  isConnected() {
    return this.connected;
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
