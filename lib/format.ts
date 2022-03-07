// This is an example of a Typescript file that is shared between the
// Server and Client side
export function formatNow(): string {
  const date = new Date();
  const parts = date.toISOString().split("T");
  const days = parts[0];
  const time = parts[1].split(".")[0];

  return `${days} at ${time}`;
}
