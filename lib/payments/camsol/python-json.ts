/**
 * Camsol signs webhooks over Python's `json.dumps(payload, sort_keys=True)`:
 * keys sorted, ", " and ": " separators, non-ASCII escaped as \uXXXX, and numbers
 * written exactly as Python wrote them (5000.0 stays "5000.0"). To verify the
 * signature we parse the raw body keeping each number's source text, then
 * re-serialise it the same way.
 */

const RAW_NUMBER = Symbol('rawNumber');
type RawNumber = { [RAW_NUMBER]: string };
type JsonLike = null | boolean | string | RawNumber | JsonLike[] | { [key: string]: JsonLike };

export function parseKeepingNumberSource(text: string): JsonLike {
  return JSON.parse(text, function (
    this: unknown,
    _key: string,
    value: unknown,
    context?: { source?: string },
  ) {
    if (typeof value === 'number') {
      // Node >= 21 passes the literal's source text to revivers
      return { [RAW_NUMBER]: context?.source ?? pythonNumber(value) } as RawNumber;
    }
    return value;
  } as unknown as Parameters<typeof JSON.parse>[1]) as JsonLike;
}

function pythonNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(value);
}

function pythonString(value: string): string {
  let out = '"';
  for (const char of value) {
    const code = char.codePointAt(0) as number;
    if (char === '"') out += '\\"';
    else if (char === '\\') out += '\\\\';
    else if (char === '\n') out += '\\n';
    else if (char === '\r') out += '\\r';
    else if (char === '\t') out += '\\t';
    else if (char === '\b') out += '\\b';
    else if (char === '\f') out += '\\f';
    else if (code < 0x20 || code > 0x7e) {
      // ensure_ascii: escape as UTF-16 code units, like Python does
      for (let i = 0; i < char.length; i += 1) {
        out += '\\u' + char.charCodeAt(i).toString(16).padStart(4, '0');
      }
    } else out += char;
  }
  return out + '"';
}

export function pythonDumpsSorted(value: JsonLike): string {
  if (value === null) return 'null';
  if (value === true) return 'true';
  if (value === false) return 'false';
  if (typeof value === 'string') return pythonString(value);
  if (Array.isArray(value)) return '[' + value.map(pythonDumpsSorted).join(', ') + ']';
  if (typeof value === 'object' && RAW_NUMBER in value) return (value as RawNumber)[RAW_NUMBER];
  const object = value as { [key: string]: JsonLike };
  const keys = Object.keys(object).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  return (
    '{' +
    keys.map((key) => `${pythonString(key)}: ${pythonDumpsSorted(object[key])}`).join(', ') +
    '}'
  );
}
