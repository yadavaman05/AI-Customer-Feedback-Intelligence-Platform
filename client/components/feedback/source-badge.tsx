import * as React from "react";
import {
    Mail,
    MessageSquare,
    Smartphone,
    Globe,
    Search,
    Clipboard,
    Share2,
    HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

type SourceType =
    | "email"
    | "chat"
    | "playstore"
    | "appstore"
    | "twitter"
    | "survey"
    | "website"
    | "google"
    | "other";

interface SourceBadgeProps {
    source: SourceType;
    className?: string;
}

export const SourceBadge = ({ source, className }: SourceBadgeProps) => {
    let label = source.charAt(0).toUpperCase() + source.slice(1);
    let icon = <HelpCircle className="h-3 w-3" />;
    let styleClasses = "bg-slate-800 text-slate-350 border-slate-700/50";

    switch (source) {
        case "email":
            label = "Email Support";
            icon = <Mail className="h-3 w-3 mr-1" />;
            styleClasses = "bg-purple-950/20 text-purple-400 border-purple-800/30";
            break;
        case "chat":
            label = "Live Chat";
            icon = <MessageSquare className="h-3 w-3 mr-1" />;
            styleClasses = "bg-rose-950/20 text-rose-400 border-rose-800/30";
            break;
        case "playstore":
            label = "Google Play Store";
            icon = <Smartphone className="h-3 w-3 mr-1" />;
            styleClasses = "bg-emerald-950/20 text-emerald-400 border-emerald-800/30";
            break;
        case "appstore":
            label = "Apple App Store";
            icon = <Smartphone className="h-3 w-3 mr-1" />;
            styleClasses = "bg-sky-950/20 text-sky-400 border-sky-800/30";
            break;
        case "twitter":
            label = "Twitter / X";
            icon = <Share2 className="h-3 w-3 mr-1" />;
            styleClasses = "bg-blue-950/20 text-blue-400 border-blue-800/30";
            break;
        case "survey":
            label = "Feedback Survey";
            icon = <Clipboard className="h-3 w-3 mr-1" />;
            styleClasses = "bg-amber-950/20 text-amber-400 border-amber-800/30";
            break;
        case "website":
            label = "Web Portal";
            icon = <Globe className="h-3 w-3 mr-1" />;
            styleClasses = "bg-indigo-950/20 text-indigo-400 border-indigo-800/30";
            break;
        case "google":
            label = "Google Review";
            icon = <Search className="h-3 w-3 mr-1" />;
            styleClasses = "bg-teal-950/20 text-teal-400 border-teal-800/30";
            break;
        default:
            label = "Other Stream";
            icon = <HelpCircle className="h-3 w-3 mr-1" />;
            styleClasses = "bg-slate-950/30 text-slate-400 border-slate-800/40";
            break;
    }

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-md px-2 py-0.5 text-3xs font-medium border uppercase tracking-wider select-none font-mono",
                styleClasses,
                className
            )}
        >
            {icon}
            {label}
        </span>
    );
};

export default SourceBadge;
