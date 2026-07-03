<script setup lang="ts">
import JSON5 from 'json5';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const defaultValue = '{\n\t"hello": [\n\t\t"world"\n\t]\n}';
const transformer = (value: string) => withDefaultOnError(() => JSON.stringify(JSON5.parse(value), null, 0), '');

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
    input-label="Your raw JSON"
    :input-default="defaultValue"
    input-placeholder="Paste your raw JSON here..."
    output-label="Minified version of your JSON"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
