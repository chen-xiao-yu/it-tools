<script setup lang="ts">
import { stringify } from 'yaml';
import JSON5 from 'json5';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const transformer = (value: string) => withDefaultOnError(() => stringify(JSON5.parse(value)), '');

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    getErrorMessage: (v: string) => {
      if (v.trim() === '') return '';
      try { JSON5.parse(v); return ''; }
      catch (e: any) {
        const line = e.lineNumber;
        const col = e.columnNumber;
        if (line && col) {
          return `第 ${line} 行，第 ${col} 列：${e.message.replace('JSON5: ', '')}`;
        }
        return e.message || '未知解析错误';
      }
    },
    message: '提供的 JSON 格式不正确：{0}',
  },
];
</script>

<template>
  <format-transformer
    input-label="Your JSON"
    input-placeholder="Paste your JSON here..."
    output-label="YAML from your JSON"
    output-language="yaml"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
