// app/api/clients/top/top.handler.ts
import { NextRequest } from 'next/server';
import { Client } from '@/models/Clients';
import dbConnect from '@/lib/db/mongoose';


export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const period = url.searchParams.get('period') as 'month' | 'quarter' | 'year' || 'year';
    
    // Get top clients by revenue
    const topClients = await Client.getTopClients(limit, period);
    
    // Get additional metrics for each client
    const enrichedClients = await Promise.all(
      topClients.map(async ({ client, revenue, orderCount }) => {
        // Get recent order trend
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        // Calculate growth rate (simplified)
        const growthRate = client.stats?.trend === 'GROWING' ? 15 : 
                          client.stats?.trend === 'DECLINING' ? -10 : 0;
        
        return {
          _id: client._id,
          clientNumber: client.clientNumber,
          name: client.name,
          category: client.category,
          clientType: client.clientType,
          revenue,
          orderCount,
          averageOrderValue: orderCount > 0 ? revenue / orderCount : 0,
          growthRate,
          trend: client.stats?.trend || 'STABLE',
          lastOrderDate: client.stats?.lastOrderDate,
          account: {
            totalPurchases: client.account?.totalPurchases || 0,
            balanceDue: client.account?.balanceDue || 0,
            onTimePaymentRate: client.account?.onTimePaymentRate || 0
          },
          flags: {
            preferred: client.flags?.preferred || false,
            isSlowPayer: client.flags?.isSlowPayer || false
          }
        };
      })
    );
    
    // Calculate summary statistics
    const summary = {
      totalRevenue: enrichedClients.reduce((sum, c) => sum + c.revenue, 0),
      totalOrders: enrichedClients.reduce((sum, c) => sum + c.orderCount, 0),
      averageRevenue: enrichedClients.length > 0 
        ? enrichedClients.reduce((sum, c) => sum + c.revenue, 0) / enrichedClients.length 
        : 0,
      topPerformer: enrichedClients[0]?.name || 'N/A',
      byCategory: enrichedClients.reduce((acc, client) => {
        const cat = client.category;
        if (!acc[cat]) acc[cat] = { count: 0, revenue: 0 };
        acc[cat].count++;
        acc[cat].revenue += client.revenue;
        return acc;
      }, {} as Record<string, { count: number; revenue: number }>)
    };
    
    return new Response(JSON.stringify({
      success: true,
      data: {
        clients: enrichedClients,
        summary,
        period
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('[Top Clients] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch top clients'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}