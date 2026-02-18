// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'prettier'],
  ignorePatterns: [
    '.expo/**',
    'android/**',
    'app/(tabs)/**',
    'babel.config.js',
    'components/PremiumSence/ui/carousel.tsx',
    'components/PremiumSence/ui/chart.tsx',
    'components/PremiumSence/ui/dropdown-menu.tsx',
    'components/PremiumSence/ui/form.tsx',
    'ios/**',
    'supabase/functions/**',
    'accessibility-fix.js',
    '**/*copy.ts',
    '**/*copy.tsx',
    '**/*backup*.ts',
    '**/*backup*.tsx',
    '**/*_backup*/**',
    '**/*.md',
  ],
  plugins: ['prettier', 'perfectionist', 'unused-imports'],
  rules: {
    'perfectionist/sort-imports': ['warn'],
    'perfectionist/sort-interfaces': ['warn'],
    'perfectionist/sort-objects': [
      'warn',
      {
        type: 'alphabetical',
      },
    ],
    'prettier/prettier': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
        vars: 'all',
        varsIgnorePattern: '^_',
      },
    ],
  },
  settings: {
    perfectionist: {
      partitionByComment: true,
      type: 'line-length',
    },
  },
};
