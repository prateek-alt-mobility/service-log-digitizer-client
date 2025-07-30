'use client';

import { useState } from 'react';
import { FileText, ExternalLink, Eye } from 'lucide-react';
import { Button } from './button';

interface PDFPreviewProps {
  fileUrl?: string;
  fileName?: string;
  size?: 'small' | 'medium' | 'large';
  showActions?: boolean;
  className?: string;
}

export function PDFPreview({ 
  fileUrl, 
  fileName, 
  size = 'medium', 
  showActions = true,
  className = '' 
}: PDFPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    small: 'w-32 h-40',
    medium: 'w-full h-96',
    large: 'w-full h-[600px]'
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const openPDF = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  if (!fileUrl) {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg flex flex-col items-center justify-center p-3 ${className}`}>
        <FileText className="h-8 w-8 text-primary mb-2" />
        <div className="text-center">
          <div className="text-xs font-medium text-primary">No PDF</div>
          <div className="text-xs text-muted-foreground">Available</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg overflow-hidden ${className}`}>
      {isLoading && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
          <div className="text-xs text-muted-foreground">Loading PDF...</div>
        </div>
      )}
      
      {hasError && (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
          <FileText className="h-12 w-12 text-primary mb-3" />
          <div className="text-center mb-4">
            <div className="text-sm font-medium text-primary mb-1">PDF Preview Unavailable</div>
            <div className="text-xs text-muted-foreground">
              {fileName || 'Document'} cannot be previewed
            </div>
          </div>
          {showActions && (
            <div className="flex gap-2">
              <Button size="sm" onClick={openPDF}>
                <ExternalLink className="h-3 w-3 mr-1" />
                Open PDF
              </Button>
            </div>
          )}
        </div>
      )}

      {!hasError && (
        <div className="w-full h-full relative">
          <iframe
            src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            className="w-full h-full border-0"
            title={`PDF Preview - ${fileName || 'Document'}`}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{ display: isLoading ? 'none' : 'block' }}
          />
          
          {showActions && !isLoading && !hasError && (
            <div className="absolute top-2 right-2 flex gap-1">
              <Button 
                size="sm" 
                variant="secondary" 
                className="h-6 w-6 p-0"
                onClick={openPDF}
                title="Open PDF in new tab"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 