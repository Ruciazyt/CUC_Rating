export function deleteByArrName(arr, name) {
  const index = arr.indexOf(name);
  if (index === -1) return arr;
  arr.splice(index, 1);
  return arr;
}
