<script setup lang="ts">
import { parse as parseYaml } from 'yaml';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

function transformer(value: string) {
  return withDefaultOnError(() => {
    const obj = parseYaml(value, { merge: true });
    return obj ? JSON.stringify(obj, null, 3) : '';
  }, '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: (v: string) => v === '' || parseYaml(v),
    getErrorMessage: (v: string) => {
      if (v.trim() === '') return '';
      try { parseYaml(v); return ''; }
      catch (e: any) {
        if (e.linePos?.[0]) {
          return `第 ${e.linePos[0].line} 行，第 ${e.linePos[0].col} 列：${e.message}`;
        }
        return e.message || '未知解析错误';
      }
    },
    message: '提供的 YAML 格式不正确：{0}',
  },
];
</script>

<template>
  <format-transformer
    input-label="Your YAML"
    input-placeholder="Paste your yaml here..."
    output-label="JSON from your YAML"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
