import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import './ConfirmModal.css';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Tasdiqlash',
  cancelText = 'Bekor qilish',
  variant = 'danger',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="modal-content"
          >
            <div className="modal-header">
              <div className={`modal-icon ${variant}`}>
                <AlertTriangle />
              </div>
              <button onClick={onClose} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <h3 className="modal-title">{title}</h3>
              <p className="modal-description">{description}</p>
            </div>

            <div className="modal-footer">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                {cancelText}
              </Button>
              <Button
                variant={variant === 'danger' ? 'destructive' : 'default'}
                onClick={onConfirm}
                disabled={isLoading}
                className="confirm-btn"
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner-sm"></span>
                    Yuklanmoqda...
                  </>
                ) : (
                  confirmText
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
