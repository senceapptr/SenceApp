export type DesignMode = 'classic' | 'neo' | 'elegant';

export const getDesignModeInfo = (mode: DesignMode) => {
  switch (mode) {
    case 'neo':
      return { label: 'NEO', icon: '✨', color: 'from-purple-600 via-cyan-500 to-pink-500' };
    case 'elegant':
      return { label: 'ELEGANT', icon: '💎', color: 'from-blue-400 via-purple-400 to-pink-400' };
    default:
      return { label: 'CLASSIC', icon: '📱', color: 'from-gray-600 to-gray-800' };
  }
};

export const getBackgroundClass = (mode: DesignMode) => {
  switch (mode) {
    case 'neo':
      return 'bg-black';
    case 'elegant':
      return 'bg-gradient-to-br from-gray-50 via-white to-blue-50';
    default:
      return 'bg-gradient-to-br from-gray-50 via-white to-blue-50';
  }
};

export const cycleDesignMode = (currentMode: DesignMode): DesignMode => {
  const modes: DesignMode[] = ['classic', 'neo', 'elegant'];
  const currentIndex = modes.indexOf(currentMode);
  const nextIndex = (currentIndex + 1) % modes.length;
  return modes[nextIndex];
};

export const getInitialPageForMode = (mode: DesignMode): string => {
  switch (mode) {
    case 'neo':
      return 'neo-home';
    case 'elegant':
      return 'elegant-home';
    default:
      return 'home';
  }
};