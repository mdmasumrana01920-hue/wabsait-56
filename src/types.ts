export type AdFormat = 'Popunder Ads' | 'Smartlink (Direct Link)' | 'In-Page Push';
export type AdStatus = 'Active' | 'Pending';

export interface AdZone {
  id: string;
  format: AdFormat;
  status: AdStatus;
  createdAt: string;
}

export interface Website {
  id: string;
  url: string;
  category: string;
  zones: AdZone[];
  createdAt: string;
}

export interface EarningsData {
  id: string;
  date: string;
  earnings: number;
  impressions: number;
  clicks: number;
  websiteId: string;
  adFormat: AdFormat;
}

export type TaskCategory = 'YouTube Video' | 'Website Visit' | 'Social Media Follow';

export interface UserTask {
  id: string;
  name: string;
  category: TaskCategory;
  url: string;
  reward: number;
  budget: number;
  remaining: number;
  createdAt: string;
  status: 'Active' | 'Completed';
}

export type PaymentMethod = 'BKash' | 'Nagad' | 'Rocket' | 'Crypto';
export type DepositStatus = 'Pending' | 'Approved' | 'Rejected';

export interface DepositRequest {
  id: string;
  method: PaymentMethod;
  amount: number;
  trxId: string;
  status: DepositStatus;
  createdAt: string;
}

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  priceBDT: number;
  priceUSD: number;
  benefit: string;
  bonus: number;
  color: string;
  isRecommended?: boolean;
}
