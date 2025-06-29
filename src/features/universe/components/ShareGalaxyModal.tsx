import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Check, Twitter, Facebook, Mail, Link } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useCelestialBodies } from '../../../hooks/useCelestialBodies';
import { useAuthStore } from '../../../stores/auth';

interface ShareGalaxyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareGalaxyModal: React.FC<ShareGalaxyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { data: celestialBodies = [] } = useCelestialBodies();
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [shareTitle, setShareTitle] = useState('');

  // Generate shareable URL (in a real app, this would create a public view)
  const shareUrl = `${window.location.origin}/galaxy/${user?.id}`;
  
  const galaxyStats = {
    totalBodies: celestialBodies.length,
    contentTypes: new Set(celestialBodies.map(b => b.content_type)).size,
    singularities: celestialBodies.filter(b => b.is_singularity).length,
    highImpact: celestialBodies.filter(b => b.has_impact).length,
  };

  const defaultTitle = `Check out my Knowledge Universe! 🌌 ${galaxyStats.totalBodies} celestial bodies across ${galaxyStats.contentTypes} different content types.`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShare = (platform: string) => {
    const title = shareTitle || defaultTitle;
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(shareUrl);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
      email: `mailto:?subject=${encodeURIComponent('Check out my Knowledge Universe!')}&body=${encodedTitle}%0A%0A${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-void-950 bg-opacity-90 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-cosmic-900 border border-cosmic-700 rounded-xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-cosmic-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-stellar-500 to-cosmic-500 rounded-full flex items-center justify-center">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Share Your Galaxy</h2>
                <p className="text-cosmic-300 text-sm">Let others explore your knowledge universe</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-cosmic-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Galaxy Preview */}
            <div className="bg-cosmic-800/50 rounded-lg p-4">
              <h3 className="text-white font-medium mb-3">Your Galaxy Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-stellar-300">{galaxyStats.totalBodies}</div>
                  <div className="text-xs text-cosmic-400">Celestial Bodies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cosmic-300">{galaxyStats.contentTypes}</div>
                  <div className="text-xs text-cosmic-400">Content Types</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-300">{galaxyStats.singularities}</div>
                  <div className="text-xs text-cosmic-400">Singularities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300">{galaxyStats.highImpact}</div>
                  <div className="text-xs text-cosmic-400">High Impact</div>
                </div>
              </div>
            </div>

            {/* Custom Message */}
            <div>
              <label className="block text-sm font-medium text-stellar-200 mb-2">
                Custom Message (Optional)
              </label>
              <Input
                type="text"
                placeholder={defaultTitle}
                value={shareTitle}
                onChange={(e) => setShareTitle(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Share Link */}
            <div>
              <label className="block text-sm font-medium text-stellar-200 mb-2">
                Share Link
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant={copied ? "cosmic" : "stellar"}
                  size="sm"
                  onClick={handleCopyLink}
                  className="px-4"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              {copied && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400 text-sm mt-2"
                >
                  Link copied to clipboard!
                </motion.p>
              )}
            </div>

            {/* Social Share Buttons */}
            <div>
              <h3 className="text-sm font-medium text-stellar-200 mb-3">Share on Social Media</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="stellar"
                  size="sm"
                  onClick={() => handleShare('twitter')}
                  className="justify-start"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>
                <Button
                  variant="stellar"
                  size="sm"
                  onClick={() => handleShare('facebook')}
                  className="justify-start"
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
                <Button
                  variant="stellar"
                  size="sm"
                  onClick={() => handleShare('linkedin')}
                  className="justify-start"
                >
                  <Link className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
                <Button
                  variant="stellar"
                  size="sm"
                  onClick={() => handleShare('email')}
                  className="justify-start"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>

            {/* Privacy Note */}
            <div className="bg-cosmic-800/30 rounded-lg p-3 border border-cosmic-600">
              <p className="text-cosmic-300 text-xs">
                <strong>Privacy Note:</strong> Sharing your galaxy creates a read-only public view. 
                Others can explore your knowledge universe but cannot modify it. You can disable 
                sharing at any time from your settings.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};