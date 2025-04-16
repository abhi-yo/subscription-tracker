import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getSubscriptions } from "@/lib/services/google";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const subscriptions = await getSubscriptions(session.accessToken);
    
    // Calculate summary
    const monthlyTotal = subscriptions
      .filter(sub => sub.interval === 'monthly')
      .reduce((sum, sub) => sum + sub.amount, 0);
    
    const yearlySubscriptions = subscriptions.filter(sub => sub.interval === 'yearly');
    const yearlyTotal = yearlySubscriptions.reduce((sum, sub) => sum + sub.amount, 0);
    const yearlyMonthlyEquivalent = yearlyTotal / 12;
    
    const totalMonthly = monthlyTotal + yearlyMonthlyEquivalent;

    return NextResponse.json({
      subscriptions,
      summary: {
        monthlyTotal,
        yearlyTotal,
        yearlyMonthlyEquivalent,
        totalMonthly
      }
    });
  } catch (error) {
    console.error("Error getting subscription summary:", error);
    return NextResponse.json(
      { error: "Failed to get subscription summary" },
      { status: 500 }
    );
  }
} 