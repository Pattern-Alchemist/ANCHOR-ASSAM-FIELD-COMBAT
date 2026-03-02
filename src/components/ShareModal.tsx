import React, { useState } from 'react';
import { X, Copy, MessageSquare, Mail, Share2, Check } from 'lucide-react';
import { useNotification } from '../hooks/useNotification';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  shareCode?: string;
}

export function ShareModal({ isOpen, onClose, itemName, shareCode }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const notification = useNotification();

  const generateShareCode = () => {
    return `ANCHOR-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  };

  const code = shareCode || generateShareCode();

  const handleCopyLink = () => {
    const link = `${window.location.origin}?share=${code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    notification.success('Share link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = `Check out this drill in ANCHOR: ${itemName} ${window.location.origin}?share=${code}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    notification.info('Opening WhatsApp...');
  };

  const handleEmail = () => {
    const subject = `Check this out: ${itemName}`;
    const body = `I found an amazing drill called "${itemName}" on ANCHOR Combat Training. Check it out: ${window.location.origin}?share=${code}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    notification.info('Opening email client...');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full">
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Share Drill</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            aria-label="Close share modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Sharing</p>
            <p className="font-semibold text-gray-900 dark:text-white text-lg truncate">
              {itemName}
            </p>
          </div>

          {/* Share Code */}
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
            <p className="text-xs text-blue-600 dark:text-blue-300 font-semibold mb-2">SHARE CODE</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 font-mono font-bold text-lg text-gray-900 dark:text-white">
                {code}
              </code>
              <button
                onClick={handleCopyLink}
                className={`p-2 rounded transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
            >
              <Copy className="w-5 h-5" />
              Copy Link
            </button>

            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              Share on WhatsApp
            </button>

            <button
              onClick={handleEmail}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors"
            >
              <Mail className="w-5 h-5" />
              Share via Email
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            Anyone with this code can view and try this drill
          </p>
        </div>
      </div>
    </div>
  );
}
