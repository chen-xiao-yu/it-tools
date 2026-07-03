<script setup lang="ts">
import convert from 'xml-js';
import { isValidXML, getXmlError } from '../xml-formatter/xml-formatter.service';
import { withDefaultOnError } from '@/utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const defaultValue = '<a x="1.234" y="It\'s"/>';
function transformer(value: string) {
  return withDefaultOnError(() => {
    return JSON.stringify(convert.xml2js(value, { compact: true }), null, 2);
  }, '');
}

const rules: UseValidationRule<string>[] = [
  {
    validator: isValidXML,
    getErrorMessage: (v: string) => getXmlError(v),
    message: '提供的 XML 格式不正确：{0}',
  },
];
</script>

<template>
  <format-transformer
    input-label="Your XML content"
    :input-default="defaultValue"
    input-placeholder="Paste your XML content here..."
    output-label="Converted JSON"
    output-language="json"
    :transformer="transformer"
    :input-validation-rules="rules"
  />
</template>
