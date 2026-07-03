import { parse as parseToml } from 'iarna-toml-esm';

export { isValidToml, getTomlError };

function isValidToml(toml: string): boolean {
  try {
    parseToml(toml);
    return true;
  }
  catch (_) {
    return false;
  }
}

function getTomlError(toml: string): string {
  if (toml.trim() === '') return '';
  try {
    parseToml(toml);
    return '';
  }
  catch (e: any) {
    if (e.line != null && e.col != null) {
      return `第 ${e.line + 1} 行，第 ${e.col + 1} 列：${e.message}`;
    }
    return e.message || '未知解析错误';
  }
}
