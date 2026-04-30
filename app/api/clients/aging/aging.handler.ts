// app/api/clients/aging/aging.handler.ts
import { NextRequest } from 'next/server';
import { Client } from '@/models/Clients';
import dbConnect from '@/lib/db/mongoose';


export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get clients with balance due
    const clients = await Client.find({ 
      'account.balanceDue': { $gt: 0 },
      isActive: true 
    })
      .select('name clientNumber category account stats flags')
      .lean();
    
    const now = new Date();
    const agingData = clients.map(client => {
      const balanceDue = client.account?.balanceDue || 0;
      const lastOrderDate = client.stats?.lastOrderDate;
      const lastPaymentDate = client.account?.lastPaymentDate;
      
      // Calculate days since last order/payment
      let daysSinceLastOrder = null;
      let daysSinceLastPayment = null;
      let agingCategory = 'CURRENT';
      
      if (lastOrderDate) {
        daysSinceLastOrder = Math.floor((now.getTime() - new Date(lastOrderDate).getTime()) / (1000 * 60 * 60 * 24));
      }
      
      if (lastPaymentDate) {
        daysSinceLastPayment = Math.floor((now.getTime() - new Date(lastPaymentDate).getTime()) / (1000 * 60 * 60 * 24));
      }
      
      // Determine aging category based on last activity
      if (daysSinceLastPayment) {
        if (daysSinceLastPayment > 90) agingCategory = '90+ DAYS';
        else if (daysSinceLastPayment > 60) agingCategory = '60-90 DAYS';
        else if (daysSinceLastPayment > 30) agingCategory = '30-60 DAYS';
      } else if (daysSinceLastOrder) {
        if (daysSinceLastOrder > 90) agingCategory = '90+ DAYS';
        else if (daysSinceLastOrder > 60) agingCategory = '60-90 DAYS';
        else if (daysSinceLastOrder > 30) agingCategory = '30-60 DAYS';
      }
      
      // Calculate risk score
      let riskScore = 0;
      if (client.flags?.isSlowPayer) riskScore += 30;
      if (client.flags?.creditSuspended) riskScore += 40;
      if (client.flags?.onHold) riskScore += 50;
      if (balanceDue > (client.account?.creditLimit || 0)) riskScore += 20;
      if (agingCategory !== 'CURRENT') riskScore += 20;
      
      return {
        _id: client._id,
        clientNumber: client.clientNumber,
        name: client.name,
        category: client.category,
        balanceDue,
        creditLimit: client.account?.creditLimit || 0,
        creditUsedPercent: client.account?.creditLimit 
          ? (balanceDue / client.account.creditLimit) * 100 
          : 0,
        lastOrderDate,
        lastPaymentDate,
        daysSinceLastOrder,
        daysSinceLastPayment,
        agingCategory,
        riskScore: Math.min(riskScore, 100),
        riskLevel: riskScore >= 70 ? 'HIGH' : riskScore >= 40 ? 'MEDIUM' : 'LOW',
        flags: {
          isSlowPayer: client.flags?.isSlowPayer || false,
          creditSuspended: client.flags?.creditSuspended || false,
          onHold: client.flags?.onHold || false,
          requiresDeposit: client.flags?.requiresDeposit || false
        }
      };
    });
    
    // Calculate summary statistics
    const summary = {
      totalOutstanding: agingData.reduce((sum, c) => sum + c.balanceDue, 0),
      clientsWithBalance: agingData.length,
      averageOutstanding: agingData.length > 0 
        ? agingData.reduce((sum, c) => sum + c.balanceDue, 0) / agingData.length 
        : 0,
      byAgingCategory: {
        CURRENT: agingData.filter(c => c.agingCategory === 'CURRENT').length,
        '30-60 DAYS': agingData.filter(c => c.agingCategory === '30-60 DAYS').length,
        '60-90 DAYS': agingData.filter(c => c.agingCategory === '60-90 DAYS').length,
        '90+ DAYS': agingData.filter(c => c.agingCategory === '90+ DAYS').length
      },
      byRiskLevel: {
        HIGH: agingData.filter(c => c.riskLevel === 'HIGH').length,
        MEDIUM: agingData.filter(c => c.riskLevel === 'MEDIUM').length,
        LOW: agingData.filter(c => c.riskLevel === 'LOW').length
      },
      highRiskTotal: agingData
        .filter(c => c.riskLevel === 'HIGH')
        .reduce((sum, c) => sum + c.balanceDue, 0)
    };
    
    return new Response(JSON.stringify({
      success: true,
      data: {
        aging: agingData,
        summary
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('[Client Aging] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch aging receivables'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}