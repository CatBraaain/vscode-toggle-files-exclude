import path from "node:path";

import { includeIgnoreFile } from "@eslint/compat";
import eslint from "@eslint/js";
import alloy from "eslint-config-alloy/base.js";
import alloyts from "eslint-config-alloy/typescript.js";
import importPlugin from "eslint-plugin-import";
import noAutoFix from "eslint-plugin-no-autofix";
import packageJson from "eslint-plugin-package-json/configs/recommended";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";

function main() {
  const setting = Object.values(SettingConfig).flat();
  const linting = Object.values(LintingConfig)
    .flat()
    .map((config) => fixable(config, "block"));
  const formatting = Object.values(FormattingConfig)
    .flat()
    .map((config) => fixable(config, "force"));
  return tseslint.config(...setting, ...linting, ...formatting);
}

function fixable(config, mode) {
  if (!config.rules) {
    return config;
  }
  const shouldBlock = mode === "block";
  const shouldForce = mode === "force";
  const newRules = Object.fromEntries(
    Object.entries(config.rules).flatMap(([key, value]) => [
      [`noAutoFix/` + key, shouldBlock ? value : "off"],
      [key, shouldForce ? value : "off"],
    ]),
  );
  return {
    ...config,
    plugins: {
      ...config.plugins,
      noAutoFix: noAutoFix,
    },
    rules: newRules,
  };
}

class SettingConfig {
  static ignore = [includeIgnoreFile(path.resolve(import.meta.dirname, ".gitignore"))];
}

class LintingConfig {
  static js = [eslint.configs.recommended, { rules: alloy.rules }];
  static ts = [
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    { rules: alloyts.rules },
  ]
    .flat()
    .map((config) => ({
      ...config,
      files: [
        // applying to ts files is for linting ts
        // applying to js files is for overriding rules duplicate between js and ts
        // applying to other files (json,html,etc) cause error when loading rules
        "**/*.{ts,cts,mts,tsx}",
        "**/*.{js,cjs,mjs,jsx}",
      ],
    }));
  static typecheckRulesSettings = [
    // Linting with Type Information https://typescript-eslint.io/getting-started/typed-linting/
    {
      languageOptions: {
        parserOptions: {
          projectService: {
            // add files outscoped from tsconfig
            allowDefaultProject: ["*.*ts", "*.*js"],
          },
          tsconfigRootDir: import.meta.dirname,
        },
        globals: {
          ...globals.node,
        },
      },
    },
    // type-checked rules for files outscoped of tsconfig
    // cause Error: `Parsing error: was not found by the project service`.
    // avoid the error with disabling typechecked rules for the files
    {
      files: ["**/*.{js,cjs,mjs,jsx}"],
      ...tseslint.configs.disableTypeChecked,
    },
  ];
  static removingTsRulesFromJs = {
    files: ["**/*.{js,cjs,mjs,jsx}"],
    rules: {
      "@typescript-eslint/explicit-member-accessibility": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  };
  static tuning = [
    {
      rules: {
        "max-params": ["off", { max: 3 }],
        "@typescript-eslint/no-unused-vars": ["off"],
        "@typescript-eslint/member-ordering": ["off"],
        "@typescript-eslint/dot-notation": ["off"],
      },
    },
  ];
}

class FormattingConfig {
  static autoFixRules = {
    files: ["**/*.{ts,cts,mts,tsx}", "**/*.{js,cjs,mjs,jsx}"],
    rules: {
      "spaced-comment": ["warn"],
      "@typescript-eslint/consistent-type-imports": ["warn"],
      "@typescript-eslint/no-wrapper-object-types": ["warn"],
    },
  };
  static preferNodeProtocol = {
    languageOptions: {
      globals: globals.builtin,
    },
    plugins: {
      unicorn,
    },
    rules: {
      "unicorn/prefer-node-protocol": "warn",
    },
  };
  static sortImport = {
    plugins: {
      importPlugin,
    },
    rules: {
      "importPlugin/consistent-type-specifier-style": ["warn", "prefer-top-level"],
      "importPlugin/first": ["warn"],
      "importPlugin/newline-after-import": ["warn", { considerComments: true }],
      "importPlugin/no-duplicates": ["warn"],
      "importPlugin/no-namespace": ["warn"],
      "importPlugin/order": [
        "warn",
        {
          "newlines-between": "always",
          named: true,
          alphabetize: {
            order: "asc",
            orderImportKind: "desc",
          },
        },
      ],
    },
  };
  static packageJson = {
    ...packageJson,
    rules: {
      ...Object.fromEntries(
        Object.entries(packageJson.rules).map(([key, _value]) => [key, "warn"]),
      ),
    },
  };
}

export default main();
