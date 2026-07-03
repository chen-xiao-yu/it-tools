<script setup lang="ts">
import { parse as parseToml } from 'iarna-toml-esm';
import { withDefaultOnError } from '../../utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const transformer = (value: string) => value === '' ? '' : withDefaultOnError(() => JSON.stringify(parseToml(value), null, 3), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || parseToml(v),
    getErrorMessage: (v: string) => {
      if (v.trim() === '') return '';
      try { parseToml(v); return ''; }
      catch (e: any) {
        if (e.line != null && e.col != null) {
          return `第 ${e.line + 1} 行，第 ${e.col + 1} 列：${e.message}`;
        }
        return e.message || '未知解析错误';
      }
    },
    message: '提供的 TOML 格式不正确：{0}',
  },
];
</script>

<template>
  <format-transformer
    input-label="Your TOML"
    input-placeholder="Paste your TOML here..."
    output-label="JSON from your TOML"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
