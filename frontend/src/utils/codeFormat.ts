export function codeFormat(order: string) {
  return `#${`00000${order}`.slice(-5)}`;
}
