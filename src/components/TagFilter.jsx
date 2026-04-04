import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, ChevronUp, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';

const TagFilter = ({ selectedTags = [], onChange, className, variant = 'card', type, filters = {} }) => {
  const { t } = useTranslation();
  const { uiMode } = useSettings();
  const isDayMode = uiMode === 'day';
  const [allTags, setAllTags] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isMobile, setIsMobile] = useState(false);
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Serialize filters to a stable string for use as effect dependency
  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      try {
        const activeFilters = Object.fromEntries(
          Object.entries(filters).filter(([, v]) => v != null && v !== '')
        );
        const res = await api.get('/tags', { params: { type, ...activeFilters }, silent: true });
        const sortedTags = res.data.sort((a, b) => (b.count || 0) - (a.count || 0));
        setAllTags(sortedTags);
      } catch {
        setAllTags([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, filtersKey]);

  const toggleTag = (tagName) => {
    const newTags = selectedTags.includes(tagName)
      ? selectedTags.filter(t => t !== tagName)
      : [...selectedTags, tagName];
    onChange(newTags);
  };

  if (loading) return null;
  
  if (allTags.length === 0) {
    console.debug(`TagFilter: No tags found for type "${type}"`);
    return null;
  }

  const isSheetVariant = variant === 'sheet';
  const initialLimit = isSheetVariant ? 14 : isMobile ? 10 : 20;
  const displayedTags = isExpanded ? allTags : allTags.slice(0, initialLimit);
  
  const containerClasses = variant === 'card' 
    ? `${isDayMode ? 'bg-white/82 backdrop-blur-3xl border border-slate-200/80 shadow-[0_18px_40px_rgba(148,163,184,0.12)]' : 'bg-[#0a0a0a]/60 backdrop-blur-3xl border border-white/10 shadow-xl'} rounded-2xl p-3 md:p-6`
    : "";

  return (
    <div className={`w-full ${className || ''}`}>
      <div className={containerClasses}>
        {!isSheetVariant ? (
          <div className="flex items-center justify-between mb-3 md:mb-4">
              <div 
                  className="flex items-center gap-2 cursor-pointer md:cursor-default" 
                  onClick={() => isMobile && setIsMobileCollapsed(!isMobileCollapsed)}
              >
                  <div className={`p-2.5 sm:p-2 rounded-lg ${variant === 'card' ? (isDayMode ? 'bg-indigo-50 text-indigo-500 border border-indigo-200/80' : 'bg-indigo-500/20 text-indigo-400') : (isDayMode ? 'bg-slate-100 text-slate-700 border border-slate-200/80' : 'bg-white/10 text-white')}`}>
                      <Filter size={isMobile ? 16 : 18} />
                  </div>
                  <span className={`font-bold text-base md:text-lg tracking-wide ${isDayMode ? 'text-slate-900' : 'text-white'}`}>{t('common.filter_by_tags', '标签筛选')}</span>
                  {isMobile && (
                      <motion.div 
                          animate={{ rotate: isMobileCollapsed ? 0 : 180 }}
                          className={`ml-1 ${isDayMode ? 'text-slate-400' : 'text-gray-400'}`}
                      >
                          <ChevronDown size={16} />
                      </motion.div>
                  )}
              </div>
              
              {selectedTags.length > 0 && (
                  <button 
                      onClick={() => onChange([])}
                      className={`text-xs font-medium flex items-center gap-1 transition-colors px-3 py-2 sm:px-3 sm:py-1.5 rounded-full min-h-[44px] sm:min-h-0 ${isDayMode ? 'text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-white border border-slate-200/80' : 'text-gray-400 hover:text-white bg-white/5 hover:bg-white/10'}`}
                  >
                      <X size={12} />
                      {t('common.clear_all', '清除全部')}
                  </button>
              )}
          </div>
        ) : (
          <div className="mb-3 pl-1">
             <span className={`text-sm font-bold ${isDayMode ? 'text-slate-700' : 'text-white/80'}`}>{t('common.filter_by_tags', '标签筛选')}</span>
          </div>
        )}

        <AnimatePresence>
            {((!isMobile || !isMobileCollapsed) || isSheetVariant) && (
                <motion.div 
                    initial={isMobile && !isSheetVariant ? { height: 0, opacity: 0 } : false}
                    animate={isMobile && !isSheetVariant ? { height: 'auto', opacity: 1 } : false}
                    exit={isMobile && !isSheetVariant ? { height: 0, opacity: 0 } : false}
                    className="overflow-hidden"
                >
                    <motion.div layout className={`flex flex-wrap ${isSheetVariant ? 'gap-2.5' : 'gap-2 md:gap-3'}`}>
                        {displayedTags.map(tag => (
                            <motion.button
                                layout
                                key={tag.name}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleTag(tag.name)}
                                className={`px-4 py-2.5 sm:py-2 rounded-2xl text-sm font-medium transition-all border flex items-center gap-2 min-h-[44px] sm:min-h-0 ${
                                    selectedTags.includes(tag.name)
                                        ? (isDayMode ? 'bg-indigo-50 text-indigo-600 border-indigo-200/80 shadow-[0_12px_28px_rgba(99,102,241,0.12)]' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.15)]')
                                        : (isDayMode ? 'bg-white/88 text-slate-500 border-slate-200/80 hover:bg-white hover:text-slate-900 hover:border-indigo-200/80' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20')
                                }`}
                            >
                                {selectedTags.includes(tag.name) && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-indigo-400 rounded-full p-0.5">
                                        <CheckCircle size={12} className="text-black" />
                                    </motion.div>
                                )}
                                {tag.name}
                                <span className={`ml-1 px-1.5 py-0.5 rounded-md text-xs font-semibold ${
                                    selectedTags.includes(tag.name) ? (isDayMode ? 'bg-indigo-100 text-indigo-600' : 'bg-indigo-500/30 text-indigo-200') : (isDayMode ? 'bg-slate-100 text-slate-500' : 'bg-white/10 text-gray-400')
                                }`}>
                                    {tag.count}
                                </span>
                            </motion.button>
                        ))}
                    </motion.div>

                    {allTags.length > initialLimit && (
                        <div className="flex justify-center mt-3 md:mt-4">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className={`flex items-center gap-1 text-xs md:text-sm transition-colors ${isDayMode ? 'text-slate-500 hover:text-slate-900' : 'text-gray-400 hover:text-white'}`}
                            >
                                {isExpanded ? (
                                    <>
                                        {t('common.show_less', 'Show Less')} <ChevronUp size={14} />
                                    </>
                                ) : (
                                    <>
                                        {t('common.show_more', 'Show More')} <ChevronDown size={14} />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TagFilter;
