// @ifdef DEBUG
function assert(assertion: boolean, details: any): void {
  if (!assertion) {
    console.error("ASSERTION FAILED");
    console.error(details);
  }
}
// @endif
