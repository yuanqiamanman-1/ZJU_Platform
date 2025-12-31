import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PrivacyModal = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const agreed = localStorage.getItem('privacy_agreed');
    if (!agreed) {
      setIsOpen(true);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem('privacy_agreed', 'true');
    setIsOpen(false);
  };

  const handleDisagree = () => {
    setIsOpen(false);
    setIsBlocked(true);
  };

  const PRIVACY_URL = 'https://agreement-drcn.hispace.dbankcloud.cn/index.html?lang=zh&agreementId=1847185101377532288';

  if (isBlocked) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-6 text-center">
        <Shield size={64} className="text-gray-500 mb-6" />
        <h1 className="text-2xl font-bold text-white mb-4">{t('privacy.access_denied', '访问被拒绝')}</h1>
        <p className="text-gray-400 max-w-md mb-8">
          {t('privacy.must_agree', '您必须同意隐私政策才能使用本网站。')}
        </p>
        <button 
          onClick={() => {
            setIsBlocked(false);
            setIsOpen(true);
          }}
          className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
        >
          {t('privacy.reconsider', '重新考虑')}
        </button>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-8 z-10"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
            <Shield size={32} className="text-indigo-400" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">
            {t('privacy.title', '隐私政策更新')}
          </h2>
          
          <p className="text-gray-300 mb-6 leading-relaxed">
            {t('privacy.description', '欢迎访问我们的网站。在继续之前，请您仔细阅读并同意我们的隐私政策。我们需要您的同意才能提供服务。')}
          </p>

          <a 
            href={PRIVACY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 underline mb-8 block transition-colors"
          >
            {t('privacy.read_policy', '阅读完整隐私政策')}
          </a>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button 
              onClick={handleDisagree}
              className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-colors"
            >
              {t('privacy.disagree', '不同意 (退出)')}
            </button>
            <button 
              onClick={handleAgree}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
            >
              {t('privacy.agree', '同意')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyModal;
