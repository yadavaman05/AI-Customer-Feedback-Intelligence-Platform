import * as React from "react";
import Button from "@/components/ui/button";
import RatingStars from "./rating-stars";
import { FeedbackItem } from "@/types/feedback";

interface FeedbackFormProps {
    onSubmitSuccess: (newItem: Omit<FeedbackItem, "id" | "createdAt" | "confidenceScore" | "sentiment" | "aiSummary" | "suggestedAction" | "keywords">) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const FeedbackForm = ({ onSubmitSuccess, onCancel, isSubmitting = false }: FeedbackFormProps) => {
    // Form field states
    const [customerName, setCustomerName] = React.useState("");
    const [customerEmail, setCustomerEmail] = React.useState("");
    const [source, setSource] = React.useState<FeedbackItem["source"] | "">("");
    const [rating, setRating] = React.useState<number>(0);
    const [category, setCategory] = React.useState<FeedbackItem["category"] | "">("");
    const [content, setContent] = React.useState("");

    // Validation error states
    const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
    const [touched, setTouched] = React.useState<{ [key: string]: boolean }>({});

    // Simple email validator regex
    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Client-side validator
    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!customerName.trim()) {
            newErrors.customerName = "Customer name is required";
        } else if (customerName.trim().length < 2) {
            newErrors.customerName = "Name must be at least 2 characters";
        }

        if (!customerEmail.trim()) {
            newErrors.customerEmail = "Email address is required";
        } else if (!validateEmail(customerEmail.trim())) {
            newErrors.customerEmail = "Please enter a valid email address";
        }

        if (!source) {
            newErrors.source = "Please select a feedback stream source";
        }

        if (rating === 0) {
            newErrors.rating = "Please select a rating score (1-5)";
        }

        if (!category) {
            newErrors.category = "Please select a feedback category";
        }

        if (!content.trim()) {
            newErrors.content = "Feedback content is required";
        } else if (content.trim().length < 10) {
            newErrors.content = "Feedback text must be at least 10 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        // Validate single field on blur for active feedback
        validate();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Touch all fields
        setTouched({
            customerName: true,
            customerEmail: true,
            source: true,
            rating: true,
            category: true,
            content: true,
        });

        if (validate()) {
            onSubmitSuccess({
                customerName: customerName.trim(),
                customerEmail: customerEmail.trim(),
                source: source as FeedbackItem["source"],
                rating,
                category: category as FeedbackItem["category"],
                content: content.trim(),
                status: "new",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-slate-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Name */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="customerName" className="text-2xs font-mono text-slate-400 uppercase tracking-wider">
                        Customer Name
                    </label>
                    <input
                        id="customerName"
                        type="text"
                        placeholder="e.g. John Miller"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        onBlur={() => handleBlur("customerName")}
                        className={`bg-slate-950 border rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition-colors ${touched.customerName && errors.customerName
                            ? "border-red-500/50 focus:border-red-500"
                            : "border-slate-800 focus:border-emerald-500/35"
                            }`}
                    />
                    {touched.customerName && errors.customerName && (
                        <p className="text-[10px] text-red-400 font-sans mt-0.5">{errors.customerName}</p>
                    )}
                </div>

                {/* Customer Email */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="customerEmail" className="text-2xs font-mono text-slate-400 uppercase tracking-wider">
                        Customer Email
                    </label>
                    <input
                        id="customerEmail"
                        type="email"
                        placeholder="john.miller@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        onBlur={() => handleBlur("customerEmail")}
                        className={`bg-slate-950 border rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition-colors ${touched.customerEmail && errors.customerEmail
                            ? "border-red-500/50 focus:border-red-500"
                            : "border-slate-800 focus:border-emerald-500/35"
                            }`}
                    />
                    {touched.customerEmail && errors.email && (
                        <p className="text-[10px] text-red-400 font-sans mt-0.5">{errors.customerEmail}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Source Select */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="source" className="text-2xs font-mono text-slate-400 uppercase tracking-wider">
                        Ingestion Stream Source
                    </label>
                    <div className="relative">
                        <select
                            id="source"
                            value={source}
                            onChange={(e) => setSource(e.target.value as FeedbackItem["source"])}
                            onBlur={() => handleBlur("source")}
                            className={`bg-slate-950 border rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none w-full cursor-pointer appearance-none ${touched.source && errors.source
                                ? "border-red-500/50 focus:border-red-500"
                                : "border-slate-800 focus:border-emerald-500/35"
                                }`}
                        >
                            <option value="">Select Ingestion Channel</option>
                            <option value="email">Email Support</option>
                            <option value="chat">Live Chat</option>
                            <option value="playstore">Google Play Store</option>
                            <option value="appstore">Apple App Store</option>
                            <option value="twitter">Twitter / X</option>
                            <option value="survey">Feedback Survey</option>
                            <option value="website">Web Portal</option>
                            <option value="google">Google Review</option>
                            <option value="other">Other Stream</option>
                        </select>
                        <div className="absolute right-3 top-3 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-400 w-0 h-0" />
                    </div>
                    {touched.source && errors.source && (
                        <p className="text-[10px] text-red-400 font-sans mt-0.5">{errors.source}</p>
                    )}
                </div>

                {/* Category Select */}
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="category" className="text-2xs font-mono text-slate-400 uppercase tracking-wider">
                        AI Classification Category
                    </label>
                    <div className="relative">
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as FeedbackItem["category"])}
                            onBlur={() => handleBlur("category")}
                            className={`bg-slate-950 border rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none w-full cursor-pointer appearance-none ${touched.category && errors.category
                                ? "border-red-500/50 focus:border-red-500"
                                : "border-slate-800 focus:border-emerald-500/35"
                                }`}
                        >
                            <option value="">Select Category</option>
                            <option value="bug">Bug Report</option>
                            <option value="feature_request">Feature Request</option>
                            <option value="ui_ux">UI/UX Layout</option>
                            <option value="performance">Speed & Latency</option>
                            <option value="pricing">Pricing / Subscription</option>
                            <option value="other">Other Dev</option>
                        </select>
                        <div className="absolute right-3 top-3 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-400 w-0 h-0" />
                    </div>
                    {touched.category && errors.category && (
                        <p className="text-[10px] text-red-400 font-sans mt-0.5">{errors.category}</p>
                    )}
                </div>
            </div>

            {/* Rating Stars Input */}
            <div className="flex flex-col gap-1.5 pt-1.5">
                <label className="text-2xs font-mono text-slate-400 uppercase tracking-wider">
                    Customer Star Rating
                </label>
                <div className="flex items-center gap-2">
                    <RatingStars
                        rating={rating}
                        interactive={true}
                        onRatingChange={(val) => {
                            setRating(val);
                            validate();
                        }}
                        size={20}
                    />
                    {rating > 0 && <span className="text-xs text-amber-400 font-mono font-bold">{rating} / 5 Stars</span>}
                </div>
                {touched.rating && errors.rating && (
                    <p className="text-[10px] text-red-400 font-sans mt-0.5">{errors.rating}</p>
                )}
            </div>

            {/* Feedback Content Textarea */}
            <div className="flex flex-col gap-1.5 pt-1">
                <label htmlFor="content" className="text-2xs font-mono text-slate-400 uppercase tracking-wider">
                    Feedback content
                </label>
                <textarea
                    id="content"
                    rows={4}
                    placeholder="Provide full text details about customer review..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onBlur={() => handleBlur("content")}
                    className={`bg-slate-950 border rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-655 focus:outline-none transition-colors resize-y ${touched.content && errors.content
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-slate-800 focus:border-emerald-500/35"
                        }`}
                />
                {touched.content && errors.content && (
                    <p className="text-[10px] text-red-400 font-sans mt-0.5">{errors.content}</p>
                )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-900 mt-6">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    className="text-slate-400 hover:text-white text-xs h-9 cursor-pointer"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    className="text-slate-950 font-bold text-xs h-9 px-5 bg-emerald-400 hover:bg-emerald-300 border-none transition-all cursor-pointer"
                >
                    Submit Feedback
                </Button>
            </div>
        </form>
    );
};

export default FeedbackForm;
