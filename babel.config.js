const path = require('path');

const projectRoot = path.resolve(__dirname);

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      [
        'module-resolver',
        {
          root: [projectRoot],
          alias: {
            '@': projectRoot,
          },
          resolvePath(sourcePath, currentFile) {
            if (sourcePath.startsWith('@/')) {
              const targetPath = path.join(projectRoot, sourcePath.slice(2));
              const currentDir = path.dirname(currentFile);
              let relative = path.relative(currentDir, targetPath);
              relative = relative.split(path.sep).join('/');
              if (!relative.startsWith('.')) relative = './' + relative;
              return relative;
            }
            return sourcePath;
          },
        },
      ],
      'react-native-reanimated/plugin', // must be last
    ],
  };
};
