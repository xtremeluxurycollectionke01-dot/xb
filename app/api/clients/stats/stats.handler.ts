// app/api/clients/stats/stats.handler.ts
import { NextRequest } from 'next/server';
import { Client } from '@/models/Clients';
import dbConnect from '@/lib/db/mongoose';


export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Get all clients
    const clients = await Client.find({})
      .select('clientType category account stats flags orders documents payments communications')
      .lean();

    const totalClients = clients.length;
    
    // Group by type
    const byType: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    
    let totalReceivables = 0;
    let clientsWithBalance = 0;
    let activeClients = 0;
    let inactiveClients = 0;
    let highRiskClients = 0;
    let preferredClients = 0;
    let onHoldClients = 0;
    
    clients.forEach(client => {
      // By type
      const clientType = client.clientType || 'INDIVIDUAL';
      byType[clientType] = (byType[clientType] || 0) + 1;
      
      // By category
      const category = client.category || 'RETAIL';
      byCategory[category] = (byCategory[category] || 0) + 1;
      
      // Financials
      const balanceDue = client.account?.balanceDue || 0;
      totalReceivables += balanceDue;
      if (balanceDue > 0) clientsWithBalance++;
      
      // Activity status
      const lastOrderDate = client.stats?.lastOrderDate;
      if (lastOrderDate) {
        const daysSinceLastOrder = Math.floor((Date.now() - new Date(lastOrderDate).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceLastOrder <= 90) {
          activeClients++;
        } else {
          inactiveClients++;
        }
      } else {
        inactiveClients++;
      }
      
      // Risk flags
      if (client.flags?.isSlowPayer || client.flags?.creditSuspended || client.flags?.onHold) {
        highRiskClients++;
      }
      
      // Preferred clients
      if (client.flags?.preferred) preferredClients++;
      
      // On hold
      if (client.flags?.onHold) onHoldClients++;
    });
    
    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivityClients = clients.filter(client => 
      client.lastActivityAt && new Date(client.lastActivityAt) >= thirtyDaysAgo
    ).length;
    
    // Get new clients this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newClientsThisMonth = clients.filter(client => 
      client.createdAt && new Date(client.createdAt) >= startOfMonth
    ).length;
    
    // Calculate average order value across all clients
    let totalOrderValue = 0;
    let clientsWithOrders = 0;
    clients.forEach(client => {
      const avgOrderValue = client.stats?.averageOrderValue || 0;
      if (avgOrderValue > 0) {
        totalOrderValue += avgOrderValue;
        clientsWithOrders++;
      }
    });
    
    const averageOrderValue = clientsWithOrders > 0 
      ? Math.round(totalOrderValue / clientsWithOrders) 
      : 0;
    
    // Get top performing categories
    const categoryPerformance: Record<string, { count: number; revenue: number }> = {};
    clients.forEach(client => {
      const category = client.category || 'RETAIL';
      if (!categoryPerformance[category]) {
        categoryPerformance[category] = { count: 0, revenue: 0 };
      }
      categoryPerformance[category].count++;
      categoryPerformance[category].revenue += client.account?.totalPurchases || 0;
    });
    
    const stats = {
      totalClients,
      activeClients,
      inactiveClients,
      newClientsThisMonth,
      recentActivityClients,
      clientsWithBalance,
      totalReceivables,
      averageReceivablesPerClient: totalClients > 0 ? totalReceivables / totalClients : 0,
      byType,
      byCategory,
      averageOrderValue,
      risk: {
        highRiskClients,
        onHoldClients,
        preferredClients,
        riskPercentage: totalClients > 0 ? (highRiskClients / totalClients) * 100 : 0
      },
      categoryPerformance: Object.entries(categoryPerformance).map(([category, data]) => ({
        category,
        clientCount: data.count,
        totalRevenue: data.revenue,
        averageRevenue: data.count > 0 ? data.revenue / data.count : 0
      })),
      lastUpdated: new Date().toISOString()
    };
    
    return new Response(JSON.stringify({
      success: true,
      data: stats
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('[Client Stats] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch client statistics'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}