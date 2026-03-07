// lib/services/timeEventEmitter.ts

/**
 * Time Management Event Emitter
 * Handles real-time updates for dashboard and notifications
 */

import { EventEmitter } from 'events';

export const timeEvents = new EventEmitter();

export enum TimeEventType {
  TASK_STARTED = 'task:started',
  TASK_COMPLETED = 'task:completed',
  TASK_INTERRUPTED = 'task:interrupted',
  TASK_TRANSFERRED = 'task:transferred',
  BOTTLENECK_DETECTED = 'bottleneck:detected',
  STAFF_IDLE = 'staff:idle'
}

export interface TimeEventPayload {
  staffId: string;
  staffName?: string;
  taskType: string;
  description: string;
  timestamp: Date;
  duration?: number;
  variance?: number;
  rating?: string;
  [key: string]: any;
}

export const emitTimeEvent = (eventType: TimeEventType, payload: TimeEventPayload) => {
  timeEvents.emit(eventType, payload);
  // Also emit to connected WebSocket clients if implemented
  console.log(`[TIME EVENT] ${eventType}:`, payload);
};

// Usage in API routes:
// import { emitTimeEvent, TimeEventType } from '@/lib/services/timeEventEmitter';
// emitTimeEvent(TimeEventType.TASK_STARTED, { staffId, taskType, description, timestamp: new Date() });