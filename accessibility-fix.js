// Accessibility Fix for React Native - Must load before React Native
// Ensure Promise is available globally
if (typeof global.Promise === 'undefined') {
  global.Promise = Promise;
}

// Store original Promise
const OriginalPromise = global.Promise;

// Mock AccessibilityInfo for iOS to prevent crashes
if (global.nativeCallSyncHook) {
  const originalNativeCallSyncHook = global.nativeCallSyncHook;
  global.nativeCallSyncHook = function(...args) {
    try {
      return originalNativeCallSyncHook(...args);
    } catch (e) {
      // Return false for accessibility queries
      return false;
    }
  };
}

export default {};
