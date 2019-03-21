export function truncate(value: string, length: number) {
  return value.length > length ? `${value.substr(0, 20)}...` : value;
}
