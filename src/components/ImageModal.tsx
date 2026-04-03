import { useEffect, useRef } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  uploaderName?: string;
  uploadDate?: string;
}

/**
 * ImageModal Component
 * Lightbox modal for viewing full-size images
 * Dismissible with ESC key or clicking outside
 */
const ImageModal = ({
  isOpen,
  onClose,
  imageSrc,
  imageAlt,
  uploaderName,
  uploadDate,
}: ImageModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageSrc);

      if (!response.ok) {
        throw new Error('Failed to download image');
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const extension = blob.type.split('/')[1] || 'jpg';

      link.href = objectUrl;
      link.download = `titlesnap.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(imageSrc, '_blank', 'noopener,noreferrer');
    }
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
      
      // Focus the close button when modal opens
      closeButtonRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle click outside to close
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
    >
      <div className="relative max-w-7xl max-h-[90vh] w-full mx-4">
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-2 transition-colors z-10"
          aria-label="Close modal"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image Container */}
        <div className="flex flex-col items-center">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            loading="eager"
            decoding="async"
          />

          {/* Image Info */}
          {(uploaderName || uploadDate) && (
            <div className="mt-4 text-center text-white">
              {uploaderName && (
                <p className="text-lg font-medium" id="modal-title">
                  Uploaded by {uploaderName}
                </p>
              )}
              {uploadDate && (
                <p className="text-sm text-gray-300 mt-1">{uploadDate}</p>
              )}
            </div>
          )}

          {/* Download Button */}
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black"
            >
              Close
            </button>
          </div>
        </div>

        {/* Instructions */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Press <kbd className="px-2 py-1 bg-gray-700 rounded">ESC</kbd> or click
          outside to close
        </p>
      </div>
    </div>
  );
};

export default ImageModal;
