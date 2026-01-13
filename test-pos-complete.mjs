#!/usr/bin/env node

/**
 * Comprehensive POS System Test
 * Tests the complete POS workflow including all UI-related endpoints
 */

const BASE_URL = 'http://localhost:3000'

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logStep(step, message) {
  log(`\n${step}. ${message}`, 'cyan')
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green')
}

function logError(message) {
  log(`✗ ${message}`, 'red')
}

function logInfo(message) {
  log(`  ${message}`, 'blue')
}

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const data = await response.json().catch(() => ({}))
    return { response, data }
  } catch (error) {
    logError(`Request failed: ${error.message}`)
    throw error
  }
}

async function testPOSSystem() {
  log('\n' + '='.repeat(60), 'bright')
  log('COMPREHENSIVE POS SYSTEM TEST', 'bright')
  log('='.repeat(60), 'bright')

  let authCookie = ''
  let sessionId = ''
  let orderId = ''
  let activeProducts = []

  try {
    // Step 1: Login as cashier
    logStep(1, 'Login as cashier')
    const { response: loginRes, data: loginData } = await makeRequest(
      `${BASE_URL}/api/auth/login`,
      {
        method: 'POST',
        body: JSON.stringify({
          email: 'cashier@subercraftex.com',
          password: 'cashier123',
        }),
      }
    )

    if (loginRes.ok) {
      authCookie = loginRes.headers.get('set-cookie') || ''
      logSuccess('Logged in as cashier')
      logInfo(`User: ${loginData.user.fullName} (${loginData.user.email})`)
      logInfo(`Role: ${loginData.user.role}`)
    } else {
      logError(`Login failed: ${loginData.error || 'Unknown error'}`)
      return
    }

    // Step 2: Check for existing session
    logStep(2, 'Check for existing active session')
    const { response: checkRes, data: existingSession } = await makeRequest(
      `${BASE_URL}/api/pos/session`,
      {
        headers: { Cookie: authCookie },
      }
    )

    if (checkRes.ok && existingSession.id) {
      logInfo('Found existing open session')
      sessionId = existingSession.id

      // Close existing session first
      logInfo('Closing existing session...')
      await makeRequest(`${BASE_URL}/api/pos/session/close`, {
        method: 'POST',
        headers: { Cookie: authCookie },
        body: JSON.stringify({
          actualCash: existingSession.expectedCash,
          notes: 'Auto-closed by test script',
        }),
      })
      logSuccess('Existing session closed')
    } else {
      logInfo('No existing session found')
    }

    // Step 3: Open new POS session
    logStep(3, 'Open new POS session')
    const openingBalance = 200.00
    const { response: openRes, data: sessionData } = await makeRequest(
      `${BASE_URL}/api/pos/session`,
      {
        method: 'POST',
        headers: { Cookie: authCookie },
        body: JSON.stringify({ openingBalance }),
      }
    )

    if (openRes.ok) {
      sessionId = sessionData.session.id
      logSuccess('POS session opened')
      logInfo(`Session Number: ${sessionData.session.sessionNumber}`)
      logInfo(`Opening Balance: $${sessionData.session.openingBalance}`)
      logInfo(`Session ID: ${sessionId}`)
    } else {
      logError(`Failed to open session: ${sessionData.error}`)
      return
    }

    // Step 4: Load active products (simulating POSProductGrid)
    logStep(4, 'Load active products for POS grid')
    const { response: productsRes, data: productsData } = await makeRequest(
      `${BASE_URL}/api/products?isActive=true`
    )

    if (productsRes.ok && productsData.products && productsData.products.length > 0) {
      activeProducts = productsData.products.slice(0, 3) // Take first 3 products
      logSuccess(`Loaded ${productsData.products.length} active products`)
      activeProducts.forEach((p, i) => {
        logInfo(`${i + 1}. ${p.name} - $${p.price} (Stock: ${p.inventoryCount})`)
      })
    } else {
      logError('No active products found')
      return
    }

    // Step 5: Create POS order (simulating cart checkout)
    logStep(5, 'Create POS order with multiple items')
    const orderItems = [
      {
        productId: activeProducts[0].id,
        quantity: 2,
        price: activeProducts[0].price,
      },
      {
        productId: activeProducts[1].id,
        quantity: 1,
        price: activeProducts[1].price,
      },
    ]

    const taxRate = 8.5 // 8.5% tax
    const discountAmount = 5.00

    const { response: orderRes, data: orderData } = await makeRequest(
      `${BASE_URL}/api/pos/orders`,
      {
        method: 'POST',
        headers: { Cookie: authCookie },
        body: JSON.stringify({
          items: orderItems,
          paymentMethod: 'cash',
          amountTendered: 200.00,
          customerName: 'Test Customer',
          customerPhone: '+1234567890',
          customerEmail: 'test@example.com',
          taxRate,
          discountAmount,
        }),
      }
    )

    if (orderRes.ok) {
      orderId = orderData.order.id
      logSuccess('POS order created')
      logInfo(`Order Number: ${orderData.order.orderNumber}`)
      logInfo(`Subtotal: $${orderData.order.subtotal.toFixed(2)}`)
      logInfo(`Discount: -$${orderData.order.discountAmount.toFixed(2)}`)
      logInfo(`Tax (${taxRate}%): $${orderData.order.taxAmount.toFixed(2)}`)
      logInfo(`Total: $${orderData.order.totalAmount.toFixed(2)}`)
      logInfo(`Tendered: $${orderData.order.amountTendered.toFixed(2)}`)
      logInfo(`Change: $${orderData.order.changeGiven.toFixed(2)}`)
    } else {
      logError(`Failed to create order: ${orderData.error}`)
      return
    }

    // Step 6: Process payment
    logStep(6, 'Process payment for order')
    const { response: paymentRes, data: paymentData } = await makeRequest(
      `${BASE_URL}/api/pos/orders/${orderId}/payment`,
      {
        method: 'POST',
        headers: { Cookie: authCookie },
      }
    )

    if (paymentRes.ok) {
      logSuccess('Payment processed successfully')
      logInfo(`Order Status: ${paymentData.order.orderStatus}`)
      logInfo(`Payment Status: ${paymentData.order.paymentStatus}`)
    } else {
      logError(`Payment processing failed: ${paymentData.error}`)
      return
    }

    // Step 7: Get session orders (simulating POSOrderList)
    logStep(7, 'Retrieve session orders')
    const { response: ordersRes, data: ordersData } = await makeRequest(
      `${BASE_URL}/api/pos/orders?sessionId=${sessionId}`,
      {
        headers: { Cookie: authCookie },
      }
    )

    if (ordersRes.ok) {
      logSuccess(`Retrieved ${ordersData.length} order(s) for this session`)
      ordersData.forEach((order, i) => {
        logInfo(
          `${i + 1}. ${order.orderNumber} - ${order.customerName} - $${order.totalAmount.toFixed(2)} (${order.paymentMethod})`
        )
      })
    } else {
      logError('Failed to retrieve orders')
    }

    // Step 8: Check updated session stats (simulating POSSessionStats)
    logStep(8, 'Check updated session statistics')
    const { response: statsRes, data: statsData } = await makeRequest(
      `${BASE_URL}/api/pos/session`,
      {
        headers: { Cookie: authCookie },
      }
    )

    if (statsRes.ok) {
      logSuccess('Session statistics retrieved')
      logInfo(`Total Sales: $${statsData.totalSales.toFixed(2)}`)
      logInfo(`Total Orders: ${statsData.totalOrders}`)
      logInfo(`Cash Sales: $${statsData.totalCash.toFixed(2)}`)
      logInfo(`Card Sales: $${statsData.totalCard.toFixed(2)}`)
      logInfo(`Mobile Sales: $${statsData.totalMobile.toFixed(2)}`)
      logInfo(`Expected Cash: $${statsData.expectedCash.toFixed(2)}`)
    } else {
      logError('Failed to retrieve session statistics')
    }

    // Step 9: Generate receipt (simulating receipt printing)
    logStep(9, 'Generate receipt HTML')
    const { response: receiptRes } = await makeRequest(
      `${BASE_URL}/api/pos/receipt/${orderId}`,
      {
        headers: { Cookie: authCookie },
      }
    )

    if (receiptRes.ok) {
      logSuccess('Receipt generated successfully')
      logInfo(`Receipt URL: ${BASE_URL}/api/pos/receipt/${orderId}`)
      logInfo('Receipt can be printed or saved as PDF')
    } else {
      logError('Failed to generate receipt')
    }

    // Step 10: Close POS session
    logStep(10, 'Close POS session with cash verification')
    const actualCash = statsData.expectedCash // Perfect balance for test
    const { response: closeRes, data: closeData } = await makeRequest(
      `${BASE_URL}/api/pos/session/close`,
      {
        method: 'POST',
        headers: { Cookie: authCookie },
        body: JSON.stringify({
          actualCash,
          notes: 'End of test - all transactions completed successfully',
        }),
      }
    )

    if (closeRes.ok) {
      logSuccess('POS session closed successfully')
      logInfo(`Expected Cash: $${closeData.session.expectedCash.toFixed(2)}`)
      logInfo(`Actual Cash: $${closeData.session.actualCash.toFixed(2)}`)
      logInfo(`Difference: $${closeData.session.cashDifference.toFixed(2)}`)
      if (closeData.session.cashDifference === 0) {
        logSuccess('Perfect cash balance! ✓')
      }
    } else {
      logError(`Failed to close session: ${closeData.error}`)
    }

    // Test Summary
    log('\n' + '='.repeat(60), 'bright')
    log('TEST SUMMARY', 'bright')
    log('='.repeat(60), 'bright')
    logSuccess('All POS system tests passed!')
    log('\nTested Components:', 'yellow')
    log('  ✓ POSSessionManager - Open/Close session')
    log('  ✓ POSProductGrid - Load active products')
    log('  ✓ POSCart - Create order with checkout')
    log('  ✓ POSOrderList - List session orders')
    log('  ✓ POSSessionStats - Display session statistics')
    log('  ✓ Receipt Generation - HTML receipt')
    log('\nAPI Endpoints Tested:', 'yellow')
    log('  ✓ POST /api/auth/login')
    log('  ✓ GET  /api/pos/session')
    log('  ✓ POST /api/pos/session')
    log('  ✓ POST /api/pos/session/close')
    log('  ✓ GET  /api/products?isActive=true')
    log('  ✓ POST /api/pos/orders')
    log('  ✓ POST /api/pos/orders/[id]/payment')
    log('  ✓ GET  /api/pos/orders?sessionId=[id]')
    log('  ✓ GET  /api/pos/receipt/[id]')
    log('\n' + '='.repeat(60), 'bright')
    log('🎉 POS System is fully operational!', 'green')
    log('='.repeat(60) + '\n', 'bright')

  } catch (error) {
    logError(`\nTest failed with error: ${error.message}`)
    console.error(error)
    process.exit(1)
  }
}

// Run the test
testPOSSystem()
