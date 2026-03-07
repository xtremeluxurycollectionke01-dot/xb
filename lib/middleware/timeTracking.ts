// lib/middleware/timeTracking.ts

/**
 * Middleware to automatically track time for specific actions
 * Usage: Wrap API handlers that should trigger time tracking
 */

import { TimeRecord } from '@/models/Time';
import { Types } from 'mongoose';

interface TrackingContext {
  staffId: string;
  taskType: 'ORDER_PROCESSING' | 'PACKING' | 'DOCUMENT_ISSUANCE' | 'CLIENT_MESSAGE';
  entityId: string;
  entityNumber: string;
  description: string;
  module: 'ORDER' | 'DOCUMENT' | 'PRODUCT' | 'CLIENT' | 'STOCK' | 'MESSAGE';
  clientId?: string;
  clientName?: string;
}

export const withTimeTracking = (context: TrackingContext) => {
  return async (handler: Function) => {
    // Start tracking before handler
    const record = await TimeRecord.startTask(
      new Types.ObjectId(context.staffId),
      context.taskType,
      {
        module: context.module,
        entityId: new Types.ObjectId(context.entityId),
        entityNumber: context.entityNumber,
        clientId: context.clientId ? new Types.ObjectId(context.clientId) : undefined,
        clientName: context.clientName
      },
      context.description,
      { deviceId: 'API', type: 'DESKTOP' } // Default device for API calls
    );

    try {
      // Execute the actual handler
      const result = await handler();
      
      // Complete tracking on success
      await TimeRecord.completeTask(
        new Types.ObjectId(context.staffId),
        new Types.ObjectId(context.entityId),
        'COMPLETED'
      );

      return result;
    } catch (error) {
      // Mark as escaped on error
      await TimeRecord.completeTask(
        new Types.ObjectId(context.staffId),
        new Types.ObjectId(context.entityId),
        'ESCAPED',
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  };
};

// Example usage in order creation:
// await withTimeTracking({
//   staffId: session.user.id,
//   taskType: 'ORDER_PROCESSING',
//   entityId: newOrder._id,
//   entityNumber: newOrder.orderNumber,
//   description: `Creating order for ${client.name}`,
//   module: 'ORDER',
//   clientId: client._id,
//   clientName: client.name
// })(async () => {
//   // Actual order creation logic here
//   return await createOrder(data);
// });