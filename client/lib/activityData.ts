export interface ActivityItem {
    id: string;
    type: "feedback_received" | "ai_analysis" | "report_generated" | "alert_triggered";
    title: string;
    description: string;
    timestamp: string;
    meta?: string;
}

export interface AlertItem {
    id: string;
    type: "negative_spike" | "low_rating" | "trending_issue" | "vip_complaint";
    title: string;
    message: string;
    severity: "high" | "medium" | "critical" | "info";
    timestamp: string;
    isRead: boolean;
}

export const mockActivities: ActivityItem[] = [
    {
        id: "act-1",
        type: "feedback_received",
        title: "New feedback via Play Store",
        description: "User David Kim left a 5-star review about version 1.4 update.",
        timestamp: "10 minutes ago",
        meta: "David Kim"
    },
    {
        id: "act-2",
        type: "alert_triggered",
        title: "Alert Triggered: Negative feedback spike",
        description: "Spike detected in API / billing categories over the last 4 hours.",
        timestamp: "45 minutes ago",
        meta: "Billing Subsystem"
    },
    {
        id: "act-3",
        type: "ai_analysis",
        title: "AI analysis completed",
        description: "Processed batch #294 containing 45 new feedback items with average confidence of 96.2%.",
        timestamp: "1 hour ago",
        meta: "Sentinel Model v2"
    },
    {
        id: "act-4",
        type: "report_generated",
        title: "Weekly Analytics Report compiled",
        description: "Exported CSV overview for John Doe (Workspace Admin).",
        timestamp: "4 hours ago",
        meta: "Auto-scheduler"
    },
    {
        id: "act-5",
        type: "feedback_received",
        title: "New feedback via Support Email",
        description: "User Alice Vance reported a 500 error in the invoice downloader.",
        timestamp: "6 hours ago",
        meta: "Alice Vance"
    },
    {
        id: "act-6",
        type: "ai_analysis",
        title: "Topic drift detected by AI",
        description: "New keyword 'webhook' trending upwards in Slack integrations requests.",
        timestamp: "12 hours ago",
        meta: "Topic Modeler"
    },
    {
        id: "act-7",
        type: "report_generated",
        title: "Backup archive synchronized",
        description: "All feedback items and analytics cache archived to storage bucket sync endpoints.",
        timestamp: "Yesterday",
        meta: "S3 Sync"
    }
];

export const mockAlerts: AlertItem[] = [
    {
        id: "alert-1",
        type: "vip_complaint",
        title: "Critical VIP Customer Complaint",
        message: "Bruce Wayne (Wayne Corp) reported seat billing tax calculations charging VAT twice in European checkout processes.",
        severity: "critical",
        timestamp: "15 minutes ago",
        isRead: false
    },
    {
        id: "alert-2",
        type: "negative_spike",
        title: "Negative Feedback Spike",
        message: "Sudden 14% spike in 'bug' category reports within the last 4 hours regarding billing PDF download failures.",
        severity: "high",
        timestamp: "32 minutes ago",
        isRead: false
    },
    {
        id: "alert-3",
        type: "trending_issue",
        title: "New Trending Issue Detected",
        message: "Search bar inputs containing accented letters (e.g. 🧑‍💻) causing front-end query crashes.",
        severity: "medium",
        timestamp: "2 hours ago",
        isRead: false
    },
    {
        id: "alert-4",
        type: "low_rating",
        title: "Low Average Rating Alert",
        message: "Average rating drops to 2.4/5 stars for the iOS client over the last 24 hours.",
        severity: "high",
        timestamp: "5 hours ago",
        isRead: true
    }
];
