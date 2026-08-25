const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("==================================================");
console.log("   DSA GUIDE SECTION VERIFICATION TEST            ");
console.log("==================================================\n");

const guideJs = fs.readFileSync(path.join(__dirname, '../data/guide_data.js'), 'utf8');
const sandbox = { window: {}, module: { exports: {} } };
vm.createContext(sandbox);
vm.runInContext(guideJs, sandbox);

const chapters = sandbox.window.GUIDE_DATA || sandbox.GUIDE_DATA || sandbox.module.exports;

if (!Array.isArray(chapters) || chapters.length === 0) {
  console.error("❌ FAIL: GUIDE_DATA is missing or empty!");
  process.exit(1);
}

console.log(`✅ Loaded ${chapters.length} DSA Guide chapters.`);
if (chapters.length !== 26) {
  console.error(`❌ FAIL: Expected 26 guide chapters, found ${chapters.length}`);
  process.exit(1);
}

let missingFields = 0;
chapters.forEach((ch, idx) => {
  if (!ch.id || !ch.title || !ch.theory || !ch.summary) {
    console.error(`Chapter #${idx+1} missing core fields:`, ch);
    missingFields++;
  }
  if (!ch.code || (typeof ch.code === 'object' && (!ch.code.cpp || !ch.code.java || !ch.code.python))) {
    console.error(`Chapter #${idx+1} missing code examples:`, ch.title);
    missingFields++;
  }
});

if (missingFields > 0) {
  console.error(`❌ FAIL: Found ${missingFields} missing fields in DSA Guide chapters!`);
  process.exit(1);
}

console.log("   Sample Chapter 1 Title:", chapters[0].title);
console.log("   Sample Chapter 26 Title:", chapters[25].title);

console.log("\n==================================================");
console.log("🎉 DSA GUIDE SECTION TEST COMPLETED PASSED 100%!");
console.log("==================================================\n");
