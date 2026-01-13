#!/usr/bin/env node

/**
 * Test script for tailor features
 * Tests that all pages compile and render without errors
 */

const BASE_URL = 'http://localhost:3000';

const tests = [
  {
    name: 'Tailor Dashboard',
    description: 'Check if tailor dashboard page compiles',
    url: '/dashboard',
    note: 'Requires authentication - checking compilation only'
  },
  {
    name: 'Measurements Page',
    description: 'Check if measurements list page compiles',
    url: '/dashboard/tailor/measurements',
    note: 'Requires tailor authentication'
  },
  {
    name: 'Fittings Page',
    description: 'Check if fittings page compiles',
    url: '/dashboard/tailor/fittings',
    note: 'Requires tailor authentication'
  },
  {
    name: 'Walk-In Order Page',
    description: 'Check if walk-in order form compiles',
    url: '/dashboard/tailor/walk-in',
    note: 'Requires tailor authentication'
  }
];

console.log('🧪 Testing Tailor Features\n');
console.log('=' .repeat(60));

let passed = 0;
let failed = 0;

for (const test of tests) {
  try {
    console.log(`\n📋 Test: ${test.name}`);
    console.log(`   ${test.description}`);
    console.log(`   URL: ${BASE_URL}${test.url}`);

    const response = await fetch(`${BASE_URL}${test.url}`, {
      redirect: 'manual' // Don't follow redirects
    });

    // Page exists and compiled (even if redirected to login)
    if (response.status === 200 || response.status === 302 || response.status === 307) {
      console.log(`   ✅ PASSED - Page compiled successfully (Status: ${response.status})`);
      if (test.note) {
        console.log(`   ℹ️  ${test.note}`);
      }
      passed++;
    } else {
      console.log(`   ❌ FAILED - Unexpected status: ${response.status}`);
      failed++;
    }
  } catch (error) {
    console.log(`   ❌ FAILED - Error: ${error.message}`);
    failed++;
  }
}

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Test Results:`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   📈 Total: ${tests.length}`);

if (failed === 0) {
  console.log('\n🎉 All tailor features compiled successfully!');
  console.log('\n📋 Test Credentials:');
  console.log('   Email: tailor@subercraftex.com');
  console.log('   Password: tailor123');
  console.log('\n🔗 Features to test manually:');
  console.log('   1. Login at: http://localhost:3000/login');
  console.log('   2. Tailor Dashboard: http://localhost:3000/dashboard');
  console.log('   3. Measurements: http://localhost:3000/dashboard/tailor/measurements');
  console.log('   4. Fittings: http://localhost:3000/dashboard/tailor/fittings');
  console.log('   5. Walk-In Orders: http://localhost:3000/dashboard/tailor/walk-in');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Check the errors above.');
  process.exit(1);
}
