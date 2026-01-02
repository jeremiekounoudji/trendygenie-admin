import { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
  Divider,
} from '@heroui/react';
import type { LegalPage, LegalPageType, CreateLegalPageInput, UpdateLegalPageInput } from '../../../types/legalPage';
import { generateSlug } from '../../../services/legalPageService';
import LegalPageEditor from './LegalPageEditor';

interface LegalPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateLegalPageInput | UpdateLegalPageInput) => Promise<void>;
  legalPage?: LegalPage | null;
  loading?: boolean;
}

const pageTypeOptions: { value: LegalPageType; label: string }[] = [
  { value: 'terms', label: 'Terms of Service' },
  { value: 'privacy', label: 'Privacy Policy' },
  { value: 'refund', label: 'Refund Policy' },
  { value: 'cookie', label: 'Cookie Policy' },
  { value: 'other', label: 'Other' },
];

interface FormData {
  title: string;
  slug: string;
  page_type: LegalPageType;
  content: string;
  is_active: boolean;
}

const initialFormData: FormData = {
  title: '',
  slug: '',
  page_type: 'other',
  content: '',
  is_active: true,
};

export function LegalPageModal({
  isOpen,
  onClose,
  onSave,
  legalPage,
  loading = false,
}: LegalPageModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);

  const isEditing = Boolean(legalPage);

  // Initialize form data when modal opens or legal page changes
  useEffect(() => {
    if (isOpen) {
      if (legalPage) {
        setFormData({
          title: legalPage.title,
          slug: legalPage.slug,
          page_type: legalPage.page_type,
          content: legalPage.content,
          is_active: legalPage.is_active,
        });
        setAutoGenerateSlug(false);
      } else {
        setFormData(initialFormData);
        setAutoGenerateSlug(true);
      }
      setErrors({});
    }
  }, [isOpen, legalPage]);

  // Auto-generate slug from title
  useEffect(() => {
    if (autoGenerateSlug && formData.title && !isEditing) {
      const newSlug = generateSlug(formData.title);
      setFormData(prev => ({ ...prev, slug: newSlug }));
    }
  }, [formData.title, autoGenerateSlug, isEditing]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    try {
      if (isEditing) {
        const updateData: UpdateLegalPageInput = {
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          is_active: formData.is_active,
        };
        await onSave(updateData);
      } else {
        const createData: CreateLegalPageInput = {
          title: formData.title,
          slug: formData.slug,
          page_type: formData.page_type,
          content: formData.content,
        };
        await onSave(createData);
      }
    } catch (error) {
      console.error('Error saving legal page:', error);
    }
  }, [formData, isEditing, onSave, validateForm]);

  const handleFieldChange = useCallback(<K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleTitleChange = useCallback((value: string) => {
    handleFieldChange('title', value);
  }, [handleFieldChange]);

  const handleSlugChange = useCallback((value: string) => {
    handleFieldChange('slug', value);
    setAutoGenerateSlug(false);
  }, [handleFieldChange]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        base: 'max-h-[90vh]',
        body: 'py-6',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {isEditing ? 'Edit Legal Page' : 'Create Legal Page'}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Title"
                  placeholder="Enter page title"
                  value={formData.title}
                  onValueChange={handleTitleChange}
                  isInvalid={Boolean(errors.title)}
                  errorMessage={errors.title}
                  isRequired
                />
                
                <div className="space-y-2">
                  <Input
                    label="Slug"
                    placeholder="page-slug"
                    value={formData.slug}
                    onValueChange={handleSlugChange}
                    isInvalid={Boolean(errors.slug)}
                    errorMessage={errors.slug}
                    isRequired
                    startContent={<span className="text-default-400">/</span>}
                  />
                  {!isEditing && (
                    <div className="flex items-center gap-2">
                      <Switch
                        size="sm"
                        isSelected={autoGenerateSlug}
                        onValueChange={setAutoGenerateSlug}
                      >
                        Auto-generate from title
                      </Switch>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Page Type"
                  placeholder="Select page type"
                  selectedKeys={[formData.page_type]}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as LegalPageType;
                    handleFieldChange('page_type', value);
                  }}
                  isDisabled={isEditing} // Don't allow changing type when editing
                  isRequired
                >
                  {pageTypeOptions.map((option) => (
                    <SelectItem key={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>

                {isEditing && (
                  <div className="flex items-center">
                    <Switch
                      isSelected={formData.is_active}
                      onValueChange={(value) => handleFieldChange('is_active', value)}
                    >
                      Active
                    </Switch>
                  </div>
                )}
              </div>
            </div>

            <Divider />

            {/* Content Editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Content</h3>
                {errors.content && (
                  <span className="text-danger text-sm">{errors.content}</span>
                )}
              </div>
              
              <LegalPageEditor
                content={formData.content}
                onChange={(content) => handleFieldChange('content', content)}
                placeholder="Enter the HTML content for this legal page..."
                disabled={loading}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={loading}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSave} isLoading={loading}>
            {isEditing ? 'Update' : 'Create'} Legal Page
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default LegalPageModal;