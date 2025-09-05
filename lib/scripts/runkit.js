// Minimal, zero-I/O demo for RunKit
console.log("🚀 RunLintic quick demo");
const pkg = require("@rdolcegroup/runlintic-app/package.json");
console.log("Version:", pkg.version);

// Keep it synchronous and fast; avoid network, fs, or child_process here.
console.log("Commands: health-check, commit, lint, release:dry");