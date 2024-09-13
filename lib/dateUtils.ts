export function parseBackendDate(dateArray: number[]): Date {
  if (!Array.isArray(dateArray) || dateArray.length < 3) {
    throw new Error("Invalid date array");
  }

  const [year, month, day, hour = 0, minute = 0, second = 0, millisecond = 0] = dateArray;
  // Nota: los meses en JavaScript Date son 0-indexados, por lo que restamos 1 al mes
  return new Date(year, month - 1, day, hour, minute, second, millisecond);
}
