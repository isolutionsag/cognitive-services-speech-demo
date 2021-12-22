export function originalIfNotEmptyOr(
  original: string,
  replacementIfEmpty: string
) {
  if (original && original.length > 0) return original;
  return replacementIfEmpty;
}
