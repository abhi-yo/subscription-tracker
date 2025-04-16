import { Subscription } from "@/lib/services/google";

interface DashboardClientProps {
  subscriptions: Subscription[];
}

declare const DashboardClient: React.FC<DashboardClientProps>;

export default DashboardClient; 