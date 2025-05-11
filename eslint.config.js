// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettier = require('eslint-config-prettier');

module.exports = tseslint.config(
  /* --------- TypeScript + inline templates --------- */
  {
    files: ['**/*.ts'],
    processor: angular.processInlineTemplates,
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      prettier                // ← neutralise les règles en conflit avec Prettier
    ],
    rules: {
      /* sélecteurs Angular  */
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' }
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' }
      ],

      /* désactive l’erreur sur les imports inutilisés             */
      /* (remplace "off" par "warn" si tu veux juste un avertissement) */
      '@typescript-eslint/no-unused-vars': 'off'
    }
  },

  /* -------------------- Templates HTML -------------------- */
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility
    ],
    rules: {
      /* désactive les règles d’accessibilité qui t’ennuient */
      '@angular-eslint/template/click-events-have-key-events': 'off',
      '@angular-eslint/template/interactive-supports-focus': 'off'
    }
  }
);
