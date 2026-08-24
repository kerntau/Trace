import React from "react";
import {
  Modal as HeroModal,
  ModalBackdrop,
  ModalContainer,
  ModalDialog,
  ModalHeader as HeroModalHeader,
  ModalHeading,
  ModalBody as HeroModalBody,
  ModalFooter as HeroModalFooter,
  ModalCloseTrigger,
} from "@heroui/react";
import { cn } from "@trace/utils";

export interface ModalProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string | number;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "full" | "cover";
}

export const Modal: React.FC<ModalProps> & {
  Backdrop: typeof ModalBackdrop;
  Container: typeof ModalContainer;
  Dialog: typeof ModalDialog;
  Header: typeof HeroModalHeader;
  Heading: typeof ModalHeading;
  Body: typeof HeroModalBody;
  Footer: typeof HeroModalFooter;
  CloseTrigger: typeof ModalCloseTrigger;
} = ({
  open,
  isOpen,
  onClose,
  title,
  children,
  footer,
  width,
  className,
  size = "md",
}) => {
  const isModalOpen = open !== undefined ? open : (isOpen ?? false);

  if (!isModalOpen) return null;

  const validSizes = ["xs", "sm", "md", "lg", "full", "cover"] as const;
  const resolvedSize = validSizes.includes(size as any) ? (size as "xs" | "sm" | "md" | "lg" | "full" | "cover") : "md";

  return (
    <HeroModal isOpen={isModalOpen} onOpenChange={(openState) => { if (!openState) onClose(); }}>
      <ModalBackdrop isOpen={isModalOpen} onOpenChange={(openState) => { if (!openState) onClose(); }}>
        <ModalContainer size={resolvedSize}>
          <ModalDialog
            className={cn("p-6 flex flex-col gap-4", className)}
            style={{ width: typeof width === "number" ? `${width}px` : width }}
          >
            {title && (
              <HeroModalHeader className="flex items-center justify-between">
                <ModalHeading className="text-lg font-semibold text-foreground">
                  {title}
                </ModalHeading>
                <ModalCloseTrigger onPress={onClose} />
              </HeroModalHeader>
            )}
            <HeroModalBody className="p-0 overflow-y-auto max-h-[75vh]">
              {children}
            </HeroModalBody>
            {footer && (
              <HeroModalFooter className="flex justify-end gap-2 pt-2">
                {footer}
              </HeroModalFooter>
            )}
          </ModalDialog>
        </ModalContainer>
      </ModalBackdrop>
    </HeroModal>
  );
};

export const ModalHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <HeroModalHeader className={className} {...(props as any)}>
    {children}
  </HeroModalHeader>
);

export const ModalBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <HeroModalBody className={className} {...(props as any)}>
    {children}
  </HeroModalBody>
);

export const ModalFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <HeroModalFooter className={className} {...(props as any)}>
    {children}
  </HeroModalFooter>
);

Modal.Backdrop = ModalBackdrop as any;
Modal.Container = ModalContainer as any;
Modal.Dialog = ModalDialog as any;
Modal.Header = ModalHeader as any;
Modal.Heading = ModalHeading as any;
Modal.Body = ModalBody as any;
Modal.Footer = ModalFooter as any;
Modal.CloseTrigger = ModalCloseTrigger as any;


