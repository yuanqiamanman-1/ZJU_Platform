import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { uiMode } = useSettings();
  const isDayMode = uiMode === 'day';
  
  return (
    <footer className={`backdrop-blur-xl pt-12 pb-[calc(3rem+4rem+env(safe-area-inset-bottom))] md:pb-12 px-6 border-t relative z-10 ${isDayMode ? 'bg-white/65 text-slate-900 border-slate-200/80' : 'bg-black/40 text-white border-white/5'}`}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tighter">拓途浙享</span>
            <span className={isDayMode ? 'text-slate-300' : 'text-white/20'}>|</span>
            <span className={`text-sm tracking-widest ${isDayMode ? 'text-slate-500' : 'text-gray-400'}`}>TUOTUZJU</span>
          </div>
          <p className={`text-xs ${isDayMode ? 'text-slate-500' : 'text-gray-500'}`}>
            © {currentYear} 浙江大学SQTP项目组. All rights reserved.
          </p>
        </div>

        <a 
          href="https://beian.miit.gov.cn/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className={`px-4 py-2 rounded-full border transition-all text-xs tracking-wider font-medium ${isDayMode ? 'bg-white/80 border-slate-200/80 text-slate-500 hover:bg-white hover:text-slate-900' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:border-white/10 hover:text-gray-300'}`}
        >
          浙ICP备2025221213号
        </a>
      </div>
    </footer>
  );
};

export default Footer;
