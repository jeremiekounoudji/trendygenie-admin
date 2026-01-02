import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full';
}

export function DetailModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'lg',
}: DetailModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 border-b border-divider">
          {title}
        </ModalHeader>
        <ModalBody className="py-4">
          {children}
        </ModalBody>
        {footer ? (
          <ModalFooter className="border-t border-divider">
            {footer}
          </ModalFooter>
        ) : (
          <ModalFooter className="border-t border-divider">
            <Button variant="light" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}

// Helper component for detail rows
interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

export function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 py-2 border-b border-divider last:border-0">
      <dt className="text-sm font-medium text-default-500 sm:w-1/3 shrink-0">
        {label}
      </dt>
      <dd className="text-sm text-default-900 sm:w-2/3">
        {value ?? <span className="text-default-400">—</span>}
      </dd>
    </div>
  );
}

// Helper component for detail sections
interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
}

export function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <div className="mb-6 last:mb-0">
      <h4 className="text-sm font-semibold text-default-700 mb-3">{title}</h4>
      <dl className="bg-default-50 rounded-lg p-3">
        {children}
      </dl>
    </div>
  );
}

export default DetailModal;
