import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { getBankTransactions, BankTransaction, BankAlertResult } from "@/lib/services/google";
import { Navbar } from "@/components/navbar";
import DashboardClient from "./dashboard-client";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/auth/signin");
  }
  
  // Fetch bank transaction data
  let result: BankAlertResult = { bankTransactions: [] };
  let error: string | null = null;
  
  if (!session.accessToken) {
    error = "Access token not available. Please sign in again.";
  } else {
    try {
      result = await getBankTransactions(session.accessToken);
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to fetch bank transaction data";
      console.error("Error fetching bank transaction data:", err);
    }
  }

  // Error handling UI
  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f5ea]">
        <Navbar />
        <main className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-semibold text-[#1a3329] mb-8">
            Could not retrieve transaction data
          </h1>
          <p className="mb-4">
            {error}
          </p>
          <p className="text-sm text-gray-600 mt-8">
            The subscription tracker needs access to your Gmail to detect subscription emails.
            Please make sure you've granted the necessary permissions and try again.
          </p>
          <div className="mt-6">
            <a 
              href="/auth/signin" 
              className="bg-[#1a3329] text-white px-4 py-2 rounded-md hover:bg-[#264135] transition-colors"
            >
              Try Again
            </a>
          </div>
        </main>
      </div>
    );
  }

  // Pass only bank transactions down
  return (
    <div className="min-h-screen bg-[#f8f5ea]">
      <Navbar />
      <DashboardClient 
        bankTransactions={result.bankTransactions} 
      />
    </div>
  );
} 