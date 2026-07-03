<script setup lang="ts">
import convert from 'xml-js';
import JSON5 from 'json5';
import { withDefaultOnError } from '@/utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const defaultValue = '{"a":{"_attributes":{"x":"1.234","y":"It\'s"}}}';
function transformer(value: string) {
  return withDefaultOnError(() => {
    return convert.js2xml(JSON5.parse(value), { compact: true });
  }, '');
}

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
    input-label="Your JSON content"
    :input-default="defaultValue"
    input-placeholder="Paste your JSON content here..."
    output-label="Converted XML"
    output-language="xml"
    :transformer="transformer"
    :input-validation-rules="rules"
  />
</template>
