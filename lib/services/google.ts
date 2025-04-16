import { google } from 'googleapis';
import { gmail_v1 } from 'googleapis'; // Add this for types

// Remove Subscription interface if no longer needed, or keep if displaying separately
// export interface Subscription { /* ... */ }
// Remove Transaction interface if no longer needed
// export interface Transaction { /* ... */ }

// Bank Transaction Interface (Keep)
export interface BankTransaction {
  id?: string; // Optional: Message ID
  type: 'debit' | 'credit' | 'unknown';
  amount: number;
  currency: string;
  description: string;
  date: string; // ISO string
}

// Updated Return Type - Focus on Bank Transactions
export interface BankAlertResult {
  bankTransactions: BankTransaction[];
}

// Common subscription services and their patterns
const SUBSCRIPTION_PATTERNS = [
  { 
    name: 'Netflix', 
    patterns: ['netflix', 'netflix.com'],
    logo: 'https://logo.clearbit.com/netflix.com',
    monthlyAmount: 15.99 
  },
  { 
    name: 'Spotify', 
    patterns: ['spotify', 'spotify.com'],
    logo: 'https://logo.clearbit.com/spotify.com',
    monthlyAmount: 9.99
  },
  { 
    name: 'Amazon Prime', 
    patterns: ['amazon prime', 'prime membership'],
    logo: 'https://logo.clearbit.com/amazon.com',
    yearlyAmount: 139
  },
  { 
    name: 'Disney+', 
    patterns: ['disney+', 'disneyplus'],
    logo: 'https://logo.clearbit.com/disney.com',
    monthlyAmount: 7.99
  },
  { 
    name: 'YouTube Premium', 
    patterns: ['youtube premium', 'youtube subscription', 'your premium benefits'],
    logo: 'https://logo.clearbit.com/youtube.com',
    monthlyAmount: 11.99
  },
  { 
    name: 'Apple Music', 
    patterns: ['apple music'],
    logo: 'https://logo.clearbit.com/apple.com',
    monthlyAmount: 9.99
  },
  {
    name: 'HBO Max', 
    patterns: ['hbo max', 'hbomax'],
    logo: 'https://logo.clearbit.com/hbo.com',
    monthlyAmount: 15.99
  },
  {
    name: 'Xbox Game Pass',
    patterns: ['xbox game pass', 'game pass ultimate'],
    logo: 'https://logo.clearbit.com/xbox.com',
    monthlyAmount: 14.99
  }
];

// Extract money amount from text (handles $ and ₹/Rs./INR)
function extractAmount(text: string): { amount: number; currency: string } | null {
  // Look for INR patterns first
  let match = text.match(/(?:₹|Rs\.?)s*(\d+(?:,\d+)*(?:\.\d{1,2})?)/i);
  if (match && match[1]) {
    const amountStr = match[1].replace(/,/g, '');
    return { amount: parseFloat(amountStr), currency: 'INR' };
  }
  // Look for USD pattern if INR not found - Remove if not needed
  match = text.match(/\$(\d+(?:,\d+)*(?:\.\d{1,2})?)/);
  if (match && match[1]) {
    const amountStr = match[1].replace(/,/g, '');
    return { amount: parseFloat(amountStr), currency: 'USD' };
  }
  return null;
}

// Helper function to recursively find and decode body parts
function findBodyRecursive(part: any, targetBody: { text: string }) {
  if (!part) return;
  if (part.mimeType === 'text/plain' && part.body?.data) {
    targetBody.text += Buffer.from(part.body.data, 'base64').toString('utf-8') + '\n';
  } else if (part.mimeType === 'text/html' && part.body?.data) {
    const htmlContent = Buffer.from(part.body.data, 'base64').toString('utf-8');
    targetBody.text += htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() + '\n';
  } else if (part.parts) {
    part.parts.forEach((subPart: any) => findBodyRecursive(subPart, targetBody));
  }
}

// Helper function to clean up extracted descriptions
function cleanDescription(desc: string): string {
  let cleaned = desc.trim();
  // Remove VPA prefixes (case-insensitive)
  cleaned = cleaned.replace(/^VPA\s+/i, '');
  // Remove email-like patterns (simple check)
  cleaned = cleaned.replace(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i, '');
  // Remove trailing dates like "on DD-MM-YY" or "on DD-MMM-YY"
  cleaned = cleaned.replace(/\s+on\s+\d{1,2}[-/]\d{1,2}[-/]\d{2,4}$/i, '');
  // Remove trailing Ref No.
  cleaned = cleaned.replace(/\s+Ref\.No.*?$/i, '');
  // Remove trailing period if exists
  cleaned = cleaned.replace(/\.$/, '');
  // Replace multiple spaces with single space and trim again
  return cleaned.replace(/\s+/g, ' ').trim();
}

// Renamed and refocused function
export async function getBankTransactions(accessToken: string): Promise<BankAlertResult> {
  console.log("getBankTransactions called for HDFC alerts.");
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  try {
    const gmail = google.gmail({ version: 'v1', auth });

    // --- Query for HDFC Alerts - Broader, focus on sender & amount presence --- 
    // Search for emails from HDFC containing "Rs" or "INR", indicating an amount
    const hdfcQuery = 'from:(alerts@hdfcbank.net OR HDFCBankAlerts@hdfcbank.com) (Rs OR INR) newer_than:1m'; 
    console.log(`Searching Gmail for HDFC Bank Alerts with Amount Presence query: ${hdfcQuery}`);

    const searchResponse = await gmail.users.messages.list({
      userId: 'me',
      q: hdfcQuery,
      maxResults: 200 
    });

    const messages = searchResponse.data.messages || [];
    console.log(`Refined HDFC Alert search found ${messages.length} messages.`);
    if (!messages.length) {
      console.log("No HDFC Bank alert emails found matching the refined query.");
      return { bankTransactions: [] };
    }

    const foundBankTransactions: BankTransaction[] = []; 

    console.log(`Processing up to ${messages.length} HDFC alert messages...`);

    for (const message of messages) { 
      if (!message.id) continue;
      console.log(`\nProcessing HDFC Alert message ID: ${message.id}`);
      try {
        const messageData = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'full' 
        });
        
        const headers = messageData.data.payload?.headers || [];
        let bodyContainer = { text: '' };
        findBodyRecursive(messageData.data.payload, bodyContainer);
        const body = bodyContainer.text;
        // Log first 300 chars of body for debugging description extraction
        console.log(`  Body Snippet: ${body.substring(0, 300).replace(/\n/g, " \\n ")}...`); 
        const sentDateHeader = headers.find(h => h.name?.toLowerCase() === 'date')?.value || '';
        const currentEmailDate = sentDateHeader ? new Date(sentDateHeader) : new Date();
        const subject = headers.find(h => h.name?.toLowerCase() === 'subject')?.value || '[No Subject]';

        console.log(`  Attempting to parse alert (assuming potential transaction).`);
        const amountResult = extractAmount(body); 

        if (amountResult && amountResult.currency === 'INR') {
            console.log(`    --> Detected INR Amount: ${amountResult.amount}`);
            let description = 'HDFC Transaction'; // Default
            let extracted = false;

            // --- Try different Regex patterns (Keep refining based on logs) --- 
            // Pattern for "...Rs XXX at MERCHANT on DATE..." (like the Cursor example)
            let match = body.match(/Rs\.\s*\d+(?:,\d+)*\.?\d*\s*(?:at|spent\s*at|purchase\s*at)\s+(.*?)(?:\s+on\s+\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|Avl\s+Bal|\.\s|Ref\.No)/i);
            if (match && match[1]) {
                description = cleanDescription(match[1]);
                extracted = true;
                console.log(`    --> Extracted Merchant (Rs... at...): ${description}`);
            }
            
            // Pattern 1: UPI transactions 
            if (!extracted) {
                match = body.match(/UPI.*txn.*of Rs\.?\s*\d+.*(?:to|payee)\s+([^\(\[\{\n\r@]+)/i);
                if (match && match[1]) {
                  description = cleanDescription(match[1]);
                  extracted = true;
                  console.log(`    --> Extracted UPI Description: ${description}`);
                }
            }
            
            // Pattern 3: Debited 'to' someone/something
            if (!extracted) {
                match = body.match(/debited\s+from.*?\s*to\s+([^\n\r\.]+)/i);
                 if (match && match[1]) {
                    description = cleanDescription(match[1]);
                    extracted = true;
                    console.log(`    --> Extracted Recipient (debited to): ${description}`);
                }
            }

            // Pattern 4: Generic 'Info:' field
            if (!extracted) {
                match = body.match(/Info:\s*([^\n\r]+)/i);
                if (match && match[1]) {
                    description = cleanDescription(match[1]);
                    extracted = true;
                    console.log(`    --> Extracted from Info field: ${description}`);
                }
            }

            if (!extracted) {
                 console.log(`    --> Could not extract specific description using patterns.`);
            }

            // We need to determine if it's Debit or Credit if query is broad
            // Simple check for now: assume debit if not clearly credit
            let transactionType: BankTransaction['type'] = 'unknown';
            const bodyLower = body.toLowerCase();
            if (bodyLower.includes('credited')) {
                transactionType = 'credit';
            } else if (bodyLower.includes('debited') || bodyLower.includes('spent') || bodyLower.includes('purchase') || bodyLower.includes('using your.*card.* for') || bodyLower.includes('upi txn')) {
                transactionType = 'debit';
            }
            console.log(`    --> Determined Type: ${transactionType}`);

            // Only add actual debits to the list for expense tracking
            if (transactionType === 'debit') {
                console.log(`    --> Adding DEBIT transaction to results.`);
                foundBankTransactions.push({
                    id: message.id,
                    type: 'debit', 
                    amount: amountResult.amount,
                    currency: 'INR',
                    description: description, 
                    date: currentEmailDate.toISOString()
                });
            } else {
                console.log(`    --> Skipping non-debit transaction.`);
            }
        } else {
            console.log(`    --> Failed to extract valid INR amount from this alert.`);
        }

      } catch (err: any) {
        console.error(`  ERROR processing message ${message.id}: ${err.message || err}`);
      }
    }
    // --- End Processing Loop --- 
    
    console.log(`\nFinished processing HDFC alerts. Found ${foundBankTransactions.length} potential debit transactions.`);

    return { 
        bankTransactions: foundBankTransactions 
    };

  } catch (error: any) {
    console.error('FATAL Error during HDFC alert fetching:', error.message || error);
    return { bankTransactions: [] }; 
  }
} 