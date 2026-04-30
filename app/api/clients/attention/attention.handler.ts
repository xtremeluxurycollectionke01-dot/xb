// app/api/clients/attention/attention.handler.ts
/*import { NextRequest } from 'next/server';
import { Client } from '@/models/Clients';
import dbConnect from '@/lib/db/mongoose';


export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get clients requiring attention
    const attentionClients = await Client.getRequiringAttention();
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const formattedClients = attentionClients.map(client => {
      const balanceDue = client.account?.balanceDue || 0;
      const daysOverdue = client.account?.oldestUnpaidInvoice 
        ? Math.floor((Date.now() - new Date(client.account.oldestUnpaidInvoice).getTime()) / (1000 * 60 * 60 * 24))
        : 0;
      
      // Determine priority
      let priority = 'MEDIUM';
      let actionRequired = 'Review account';
      
      if (client.flags?.onHold) {
        priority = 'HIGH';
        actionRequired = 'Account on hold - requires immediate attention';
      } else if (client.flags?.creditSuspended && balanceDue > 0) {
        priority = 'HIGH';
        actionRequired = 'Credit suspended - payment required';
      } else if (balanceDue > 0 && daysOverdue > 60) {
        priority = 'HIGH';
        actionRequired = 'Overdue balance > 60 days - collection action needed';
      } else if (balanceDue > 0 && daysOverdue > 30) {
        priority = 'MEDIUM';
        actionRequired = 'Overdue balance - contact client';
      } else if (client.flags?.isSlowPayer) {
        priority = 'MEDIUM';
        actionRequired = 'Slow payer - review payment terms';
      } else if (client.flags?.highMaintenance) {
        priority = 'LOW';
        actionRequired = 'High maintenance - review support process';
      }
      
      return {
        _id: client._id,
        clientNumber: client.clientNumber,
        name: client.name,
        primaryPhone: client.phones?.find(p => p.isPrimary)?.number || client.phones?.[0]?.number,
        primaryEmail: client.emails?.[0],
        category: client.category,
        balanceDue,
        daysOverdue,
        lastOrderDate: client.stats?.lastOrderDate,
        lastActivityAt: client.lastActivityAt,
        flags: {
          onHold: client.flags?.onHold || false,
          creditSuspended: client.flags?.creditSuspended || false,
          isSlowPayer: client.flags?.isSlowPayer || false,
          highMaintenance: client.flags?.highMaintenance || false,
          requiresDeposit: client.flags?.requiresDeposit || false
        },
        priority,
        actionRequired,
        assignedTo: client.assignedTo
      };
    });
    
    // Sort by priority
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    formattedClients.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    // Summary
    const summary = {
      totalAttentionRequired: formattedClients.length,
      byPriority: {
        HIGH: formattedClients.filter(c => c.priority === 'HIGH').length,
        MEDIUM: formattedClients.filter(c => c.priority === 'MEDIUM').length,
        LOW: formattedClients.filter(c => c.priority === 'LOW').length
      },
      totalOutstanding: formattedClients.reduce((sum, c) => sum + c.balanceDue, 0),
      averageDaysOverdue: formattedClients
        .filter(c => c.daysOverdue > 0)
        .reduce((sum, c) => sum + c.daysOverdue, 0) / (formattedClients.filter(c => c.daysOverdue > 0).length || 1)
    };
    
    return new Response(JSON.stringify({
      success: true,
      data: {
        clients: formattedClients,
        summary
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('[Attention Clients] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch clients requiring attention'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}*/

// app/api/clients/attention/attention.handler.ts
import { NextRequest } from 'next/server';
import { Client } from '@/models/Clients';
import dbConnect from '@/lib/db/mongoose';


export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get clients requiring attention
    const attentionClients = await Client.getRequiringAttention();
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const formattedClients = attentionClients.map(client => {
      const balanceDue = client.account?.balanceDue || 0;
      const daysOverdue = client.account?.oldestUnpaidInvoice 
        ? Math.floor((Date.now() - new Date(client.account.oldestUnpaidInvoice).getTime()) / (1000 * 60 * 60 * 24))
        : 0;
      
      // Determine priority
      let priority = 'MEDIUM';
      let actionRequired = 'Review account';
      
      if (client.flags?.onHold) {
        priority = 'HIGH';
        actionRequired = 'Account on hold - requires immediate attention';
      } else if (client.flags?.creditSuspended && balanceDue > 0) {
        priority = 'HIGH';
        actionRequired = 'Credit suspended - payment required';
      } else if (balanceDue > 0 && daysOverdue > 60) {
        priority = 'HIGH';
        actionRequired = 'Overdue balance > 60 days - collection action needed';
      } else if (balanceDue > 0 && daysOverdue > 30) {
        priority = 'MEDIUM';
        actionRequired = 'Overdue balance - contact client';
      } else if (client.flags?.isSlowPayer) {
        priority = 'MEDIUM';
        actionRequired = 'Slow payer - review payment terms';
      } else if (client.flags?.highMaintenance) {
        priority = 'LOW';
        actionRequired = 'High maintenance - review support process';
      }
      
      return {
        _id: client._id,
        clientNumber: client.clientNumber,
        name: client.name,
        primaryPhone: client.phones?.find(p => p.isPrimary)?.number || client.phones?.[0]?.number,
        primaryEmail: client.emails?.[0],
        category: client.category,
        balanceDue,
        daysOverdue,
        lastOrderDate: client.stats?.lastOrderDate,
        lastActivityAt: client.lastActivityAt,
        flags: {
          onHold: client.flags?.onHold || false,
          creditSuspended: client.flags?.creditSuspended || false,
          isSlowPayer: client.flags?.isSlowPayer || false,
          highMaintenance: client.flags?.highMaintenance || false,
          requiresDeposit: client.flags?.requiresDeposit || false
        },
        priority,
        actionRequired,
        assignedTo: client.assignedTo
      };
    });
    
    // Sort by priority
    const priorityOrder: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    formattedClients.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    // Summary
    const summary = {
      totalAttentionRequired: formattedClients.length,
      byPriority: {
        HIGH: formattedClients.filter(c => c.priority === 'HIGH').length,
        MEDIUM: formattedClients.filter(c => c.priority === 'MEDIUM').length,
        LOW: formattedClients.filter(c => c.priority === 'LOW').length
      },
      totalOutstanding: formattedClients.reduce((sum, c) => sum + c.balanceDue, 0),
      averageDaysOverdue: formattedClients
        .filter(c => c.daysOverdue > 0)
        .reduce((sum, c) => sum + c.daysOverdue, 0) / (formattedClients.filter(c => c.daysOverdue > 0).length || 1)
    };
    
    return new Response(JSON.stringify({
      success: true,
      data: {
        clients: formattedClients,
        summary
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('[Attention Clients] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch clients requiring attention'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}