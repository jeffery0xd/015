import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [beijingTime, setBeijingTime] = useState(new Date());
  const [mexicoTime, setMexicoTime] = useState(new Date());

  // Listen for theme changes from parent component
  useEffect(() => {
    const handleThemeChange = (event) => {
      setIsDark(event.detail.isDark);
    };

    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  // Update times every second
  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      
      // 北京时间 (UTC+8) - 使用正确的时区转换
      const beijingTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Shanghai"}));
      
      // 墨西哥时间 (UTC-6, 墨西哥城时间)
      const mexicoTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Mexico_City"}));
      
      console.log('更新时间:', {
        current: now.toLocaleString(),
        beijing: beijingTime.toLocaleString(),
        mexico: mexicoTime.toLocaleString(),
        beijingISO: beijingTime.toISOString(),
        mexicoISO: mexicoTime.toISOString()
      });
      
      setBeijingTime(beijingTime);
      setMexicoTime(mexicoTime);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    // Notify parent component about theme change
    const event = new CustomEvent('themeChange', { 
      detail: { isDark: newTheme } 
    });
    window.dispatchEvent(event);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, beijingTime, mexicoTime }}>
      {children}
    </ThemeContext.Provider>
  );
};