import * as React from "react";
import Modal from "@/components/ui/modal";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
}

export const FeedbackModal = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    size = "md",
}: FeedbackModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            description={description}
            footer={footer}
            size={size}
        >
            {children}
        </Modal>
    );
};

export default FeedbackModal;
