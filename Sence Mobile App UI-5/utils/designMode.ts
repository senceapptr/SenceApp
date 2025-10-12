export type DesignMode = 'classic';

export const getDesignModeInfo = (mode: DesignMode) => {
  return { label: 'CLASSIC', icon: '🎯', color: 'from-[#432870] to-[#B29EFD]' };
};

export const getBackgroundClass = (mode: DesignMode) => {
  return 'bg-[#F2F3F5]';
};

export const cycleDesignMode = (currentMode: DesignMode): DesignMode => {
  return 'classic'; // Always return classic since it's the only mode
};

export const getInitialPageForMode = (mode: DesignMode): string => {
  return 'home';
};