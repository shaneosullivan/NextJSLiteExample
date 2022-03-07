// This is an example of a JS file that is required from the main
// file
export async function getApiContent() {
  return await fetch(`/api/getApiContent`).then((res) =>
    res.ok ? res.text() : "Failure"
  );
}
