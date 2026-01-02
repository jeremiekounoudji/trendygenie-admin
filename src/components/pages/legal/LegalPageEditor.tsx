import { useState, useCallback } from 'react';
import { Textarea, Button, Tabs, Tab, Card, CardBody } from '@heroui/react';

interface LegalPageEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minRows?: number;
  maxRows?: number;
}

export function LegalPageEditor({
  content,
  onChange,
  placeholder = 'Enter HTML content...',
  disabled = false,
  minRows = 10,
  maxRows = 20,
}: LegalPageEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const handleContentChange = useCallback((value: string) => {
    onChange(value);
  }, [onChange]);

  const formatHTML = useCallback(() => {
    try {
      // Basic HTML formatting - add proper indentation
      let formatted = content
        .replace(/></g, '>\n<')
        .replace(/^\s+|\s+$/g, '');
      
      const lines = formatted.split('\n');
      let indentLevel = 0;
      const indentSize = 2;
      
      const formattedLines = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        
        // Decrease indent for closing tags
        if (trimmed.startsWith('</')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        const indentedLine = ' '.repeat(indentLevel * indentSize) + trimmed;
        
        // Increase indent for opening tags (but not self-closing)
        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
          indentLevel++;
        }
        
        return indentedLine;
      });
      
      const formattedContent = formattedLines.join('\n');
      handleContentChange(formattedContent);
    } catch (error) {
      console.error('Error formatting HTML:', error);
    }
  }, [content, handleContentChange]);

  const insertTag = useCallback((tag: string) => {
    const openTag = `<${tag}>`;
    const closeTag = `</${tag}>`;
    const newContent = content + openTag + closeTag;
    handleContentChange(newContent);
  }, [content, handleContentChange]);

  const commonTags = [
    { label: 'Paragraph', tag: 'p' },
    { label: 'Heading 1', tag: 'h1' },
    { label: 'Heading 2', tag: 'h2' },
    { label: 'Heading 3', tag: 'h3' },
    { label: 'Bold', tag: 'strong' },
    { label: 'Italic', tag: 'em' },
    { label: 'Link', tag: 'a href=""' },
    { label: 'List', tag: 'ul' },
    { label: 'List Item', tag: 'li' },
    { label: 'Div', tag: 'div' },
    { label: 'Span', tag: 'span' },
    { label: 'Break', tag: 'br' },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 bg-default-50 rounded-lg border border-divider">
        <div className="flex flex-wrap gap-1">
          {commonTags.map(({ label, tag }) => (
            <Button
              key={tag}
              size="sm"
              variant="flat"
              color="primary"
              onPress={() => insertTag(tag)}
              isDisabled={disabled}
              className="text-xs"
            >
              {label}
            </Button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <Button
            size="sm"
            variant="flat"
            color="secondary"
            onPress={formatHTML}
            isDisabled={disabled}
          >
            Format HTML
          </Button>
        </div>
      </div>

      {/* Editor Tabs */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as 'edit' | 'preview')}
        className="w-full"
      >
        <Tab key="edit" title="Edit">
          <Card>
            <CardBody className="p-0">
              <Textarea
                value={content}
                onValueChange={handleContentChange}
                placeholder={placeholder}
                isDisabled={disabled}
                minRows={minRows}
                maxRows={maxRows}
                variant="flat"
                classNames={{
                  input: 'font-mono text-sm',
                  inputWrapper: 'border-none shadow-none',
                }}
              />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="preview" title="Preview">
          <Card>
            <CardBody>
              <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
                {content ? (
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                ) : (
                  <p className="text-default-400 italic">No content to preview</p>
                )}
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>

      {/* Help Text */}
      <div className="text-xs text-default-500 space-y-1">
        <p>• Use the toolbar buttons to insert common HTML tags</p>
        <p>• Switch to Preview tab to see how your content will look</p>
        <p>• Use Format HTML button to clean up indentation</p>
        <p>• All HTML tags are supported, but be careful with scripts and styles</p>
      </div>
    </div>
  );
}

export default LegalPageEditor;