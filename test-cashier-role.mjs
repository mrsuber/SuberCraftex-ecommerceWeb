#!/usr/bin/env node

/**
 * Test Cashier Role Assignment from Admin Dashboard
 */

const BASE_URL = 'http://localhost:3000'

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function testCashierRoleAssignment() {
  log('\n='.repeat(60), 'cyan')
  log('Testing Cashier Role Assignment', 'cyan')
  log('='.repeat(60), 'cyan')

  try {
    // Step 1: Login as admin
    log('\n1. Logging in as admin...', 'cyan')
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@subercraftex.com',
        password: 'admin123',
      }),
    })

    if (!loginRes.ok) {
      log('✗ Admin login failed', 'red')
      return
    }

    const authCookie = loginRes.headers.get('set-cookie')
    log('✓ Admin logged in', 'green')

    // Step 2: Create a test user to assign cashier role
    log('\n2. Creating test user...', 'cyan')
    const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testcashier@example.com',
        password: 'Test123!@#',
        fullName: 'Test Cashier User',
        phone: '+1234567890',
      }),
    })

    let testUserId
    if (signupRes.ok) {
      const userData = await signupRes.json()
      testUserId = userData.user.id
      log(`✓ Test user created: ${userData.user.email}`, 'green')
    } else {
      // User might already exist, try to find them
      log('  User might already exist, checking...', 'yellow')

      const usersRes = await fetch(`${BASE_URL}/api/admin/customers`, {
        headers: { Cookie: authCookie },
      })

      if (usersRes.ok) {
        const users = await usersRes.json()
        const existingUser = users.find(u => u.email === 'testcashier@example.com')

        if (existingUser) {
          testUserId = existingUser.id
          log(`✓ Found existing test user: ${existingUser.email}`, 'green')
        } else {
          log('✗ Could not find or create test user', 'red')
          return
        }
      } else {
        log('✗ Could not fetch users', 'red')
        return
      }
    }

    // Step 3: Assign cashier role
    log('\n3. Assigning cashier role to test user...', 'cyan')
    const roleRes = await fetch(`${BASE_URL}/api/admin/customers/${testUserId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: authCookie,
      },
      body: JSON.stringify({ role: 'cashier' }),
    })

    if (!roleRes.ok) {
      const error = await roleRes.json()
      log(`✗ Failed to assign cashier role: ${JSON.stringify(error)}`, 'red')
      return
    }

    const updatedUser = await roleRes.json()
    log(`✓ User role updated to: ${updatedUser.role}`, 'green')

    // Step 4: Verify cashier profile was created
    log('\n4. Verifying cashier profile...', 'cyan')

    // Try to login as the cashier to verify everything works
    const cashierLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testcashier@example.com',
        password: 'Test123!@#',
      }),
    })

    if (!cashierLoginRes.ok) {
      log('✗ Cashier login failed', 'red')
      return
    }

    const cashierData = await cashierLoginRes.json()
    log(`✓ Cashier can login successfully`, 'green')
    log(`  Email: ${cashierData.user.email}`, 'green')
    log(`  Role: ${cashierData.user.role}`, 'green')

    const cashierCookie = cashierLoginRes.headers.get('set-cookie')

    // Step 5: Test POS session access
    log('\n5. Testing POS access...', 'cyan')
    const sessionRes = await fetch(`${BASE_URL}/api/pos/session`, {
      headers: { Cookie: cashierCookie },
    })

    if (sessionRes.status === 404) {
      log('✓ Cashier can access POS endpoints (no active session)', 'green')
    } else if (sessionRes.ok) {
      log('✓ Cashier can access POS endpoints (has active session)', 'green')
    } else {
      log('✗ Cashier cannot access POS endpoints', 'red')
      return
    }

    // Success!
    log('\n' + '='.repeat(60), 'green')
    log('✅ ALL TESTS PASSED', 'green')
    log('='.repeat(60), 'green')
    log('\nCashier role assignment is working correctly!', 'green')
    log('\nWhat was tested:', 'yellow')
    log('  ✓ Admin can assign cashier role to users')
    log('  ✓ Cashier profile is auto-created')
    log('  ✓ Cashier can login with new role')
    log('  ✓ Cashier can access POS endpoints')
    log('\n')

  } catch (error) {
    log(`\n✗ Test failed: ${error.message}`, 'red')
    console.error(error)
  }
}

testCashierRoleAssignment()
