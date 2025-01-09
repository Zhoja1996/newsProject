import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginTypeScript from "@typescript-eslint/eslint-plugin";
import parserTypeScript from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: globals.browser,
      parser: parserTypeScript,
    },
    rules: {
      // Общие правила
      "no-unused-vars": ["warn", { vars: "all", args: "after-used", ignoreRestSiblings: true }],
      curly: ["error", "all"], // Требовать фигурные скобки для всех блоков
    },
  },
  {
    // Конфигурация для JavaScript (JS)
    ...pluginJs.configs.recommended,
  },
  {
    // Конфигурация для React
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect", // Автоматическое определение версии React
      },
    },
    rules: {
      // Кастомные правила для React
      "react/react-in-jsx-scope": "off", // Отключить правило для React импорта в новых версиях
      "react/prop-types": "off", // Отключить проверку PropTypes, если не используется
      "react/jsx-uses-react": "off", // Устаревшее правило
      "react/jsx-uses-vars": "error", // Убедиться, что переменные используются в JSX
    },
  },
  {
    // Конфигурация для TypeScript
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: parserTypeScript,
    },
    rules: {
      ...pluginTypeScript.configs.recommended.rules,
    },
  },
];