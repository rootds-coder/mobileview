const fs = require('fs');
const path = require('path');

// Read current package.json
const packagePath = path.join(__dirname, 'package.json');
const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Add nodemailer to dependencies
if (!packageData.dependencies.nodemailer) {
    packageData.dependencies.nodemailer = '^6.9.7';
    console.log('Added nodemailer to package.json dependencies');
}

// Write updated package.json
fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2));
console.log('Updated package.json with nodemailer dependency');

console.log('\nTo install nodemailer, run:');
console.log('npm install');
console.log('\nOr if you have PowerShell execution policy issues:');
console.log('Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser');
console.log('npm install'); 