<script setup lang="ts">
import { stringify as stringifyToml } from 'iarna-toml-esm';
import { parse as parseYaml } from 'yaml';
import { withDefaultOnError } from '../../utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const convertYamlToToml = (value: string) => [stringifyToml(parseYaml(value))].flat().join('\n').trim();

const transformer = (value: string) => value.trim() === '' ? '' : withDefaultOnError(() => convertYamlToToml(value), '');

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
    input-placeholder="Paste your YAML here..."
    output-label="TOML from your YAML"
    output-language="toml"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
