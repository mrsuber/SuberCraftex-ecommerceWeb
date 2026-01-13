#!/usr/bin/env node

/**
 * Simple POS System Test with detailed debugging
 */

const BASE_URL = 'http://localhost:3000'

async function testLogin() {
  console.log('\n🧪 Testing Cashier Login...')

  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'cashier@subercraftex.com',
        password: 'cashier123',
      }),
    })

    console.log(`  Status: ${response.status} ${response.statusText}`)
    console.log(`  Content-Type: ${response.headers.get('content-type')}`)

    const contentType = response.headers.get('content-type')

    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()

      if (response.ok) {
        console.log('✓ Login successful')
        console.log(`  User: ${data.user.fullName}`)
        console.log(`  Email: ${data.user.email}`)
        console.log(`  Role: ${data.user.role}`)

        const authCookie = response.headers.get('set-cookie')
        console.log(`  Cookie: ${authCookie ? 'Set' : 'Not set'}`)

        return { success: true, cookie: authCookie, user: data.user }
      } else {
        console.log('✗ Login failed:', data.error || data.message || 'Unknown error')
        return { success: false }
      }
    } else {
      const text = await response.text()
      console.log('✗ Unexpected response type')
      console.log(`  Response preview: ${text.substring(0, 200)}...`)
      return { success: false }
    }
  } catch (error) {
    console.log('✗ Request error:', error.message)
    return { success: false }
  }
}

async function testSession(cookie) {
  console.log('\n🧪 Testing Session Management...')

  try {
    // Check for existing session
    const response = await fetch(`${BASE_URL}/api/pos/session`, {
      headers: { Cookie: cookie },
    })

    console.log(`  Status: ${response.status}`)

    if (response.status === 404) {
      console.log('  No active session (expected)')

      // Open new session
      console.log('\n🧪 Opening new session...')
      const openResponse = await fetch(`${BASE_URL}/api/pos/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
        },
        body: JSON.stringify({ openingBalance: 100.00 }),
      })

      const openData = await openResponse.json()

      if (openResponse.ok) {
        console.log('✓ Session opened successfully')
        console.log(`  Session Number: ${openData.session.sessionNumber}`)
        console.log(`  Opening Balance: $${openData.session.openingBalance}`)
        return { success: true, sessionId: openData.session.id }
      } else {
        console.log('✗ Failed to open session:', openData.error)
        return { success: false }
      }
    } else if (response.ok) {
      const session = await response.json()
      console.log('✓ Active session found')
      console.log(`  Session Number: ${session.sessionNumber}`)
      return { success: true, sessionId: session.id }
    } else {
      console.log('✗ Session check failed')
      return { success: false }
    }
  } catch (error) {
    console.log('✗ Request error:', error.message)
    return { success: false }
  }
}

async function testProducts() {
  console.log('\n🧪 Testing Product Loading...')

  try {
    const response = await fetch(`${BASE_URL}/api/products?isActive=true`)
    const data = await response.json()

    if (response.ok && data.products && data.products.length > 0) {
      console.log(`✓ Loaded ${data.products.length} active products`)
      console.log(`  Sample: ${data.products[0].name} - $${data.products[0].price}`)
      return { success: true, products: data.products.slice(0, 2) }
    } else {
      console.log('✗ No products found')
      return { success: false }
    }
  } catch (error) {
    console.log('✗ Request error:', error.message)
    return { success: false }
  }
}

async function runTests() {
  console.log('\n' + '='.repeat(60))
  console.log('SIMPLE POS SYSTEM TEST')
  console.log('='.repeat(60))

  // Test login
  const loginResult = await testLogin()
  if (!loginResult.success) {
    console.log('\n❌ Tests failed - cannot proceed without login')
    return
  }

  // Test session
  const sessionResult = await testSession(loginResult.cookie)
  if (!sessionResult.success) {
    console.log('\n❌ Tests failed - session management not working')
    return
  }

  // Test products
  const productsResult = await testProducts()
  if (!productsResult.success) {
    console.log('\n❌ Tests failed - cannot load products')
    return
  }

  console.log('\n' + '='.repeat(60))
  console.log('✅ All basic tests passed!')
  console.log('='.repeat(60))
  console.log('\nNext: Test full order creation and payment flow')
}

runTests().catch(console.error)
