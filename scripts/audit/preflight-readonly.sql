-- SuberCraftex pre-migration audit. READ ONLY: every statement runs in a read-only
-- session, so nothing can be changed. Output is totals and investor numbers only
-- (no names, emails, phones or documents), safe to paste back.
--
-- Run on the VPS:
--   docker exec -i -e PGPASSWORD="$DB_PASSWORD" mohamad-postgres \
--     psql -U mohamad_db_user -d subercraftex_db -v ON_ERROR_STOP=0 < preflight-readonly.sql > preflight.txt 2>&1

SET default_transaction_read_only = on;
\pset pager off

\echo '== 1. Migration history recorded in the database'
SELECT migration_name, finished_at, rolled_back_at IS NOT NULL AS rolled_back
FROM _prisma_migrations ORDER BY started_at;

\echo '== 2. Tables in the database'
SELECT count(*) AS tables FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

\echo '== 3. Users by role and email-verified (suspended users show as not verified)'
SELECT role, email_verified, count(*) FROM users GROUP BY 1, 2 ORDER BY 1, 2;

\echo '== 4. Investor balances against their own transaction history'
WITH last_tx AS (
  SELECT DISTINCT ON (investor_id) investor_id, balance_after, profit_after, created_at
  FROM investor_transactions ORDER BY investor_id, created_at DESC
), deposits AS (
  SELECT investor_id, sum(amount) AS confirmed_deposits
  FROM investor_deposits WHERE confirmation_status = 'confirmed' GROUP BY 1
), tx AS (
  SELECT investor_id,
         sum(amount) FILTER (WHERE type = 'deposit')                    AS tx_deposits,
         sum(amount) FILTER (WHERE type IN ('allocation_product','allocation_equipment')) AS tx_allocated,
         sum(amount) FILTER (WHERE type = 'profit_credit')              AS tx_profit_credit,
         sum(amount) FILTER (WHERE type::text LIKE 'withdrawal%')             AS tx_withdrawn,
         sum(amount) FILTER (WHERE type = 'refund')                     AS tx_refund,
         count(*) AS tx_count
  FROM investor_transactions GROUP BY 1
)
SELECT i.investor_number, i.status, i.kyc_status,
       i.cash_balance, i.profit_balance, i.total_invested, i.total_profit, i.total_withdrawn,
       d.confirmed_deposits, t.tx_deposits, t.tx_allocated, t.tx_profit_credit, t.tx_withdrawn, t.tx_refund, t.tx_count,
       l.balance_after AS last_tx_cash, l.profit_after AS last_tx_profit,
       (l.balance_after IS DISTINCT FROM i.cash_balance)   AS cash_mismatch,
       (l.profit_after  IS DISTINCT FROM i.profit_balance) AS profit_mismatch
FROM investors i
LEFT JOIN last_tx l ON l.investor_id = i.id
LEFT JOIN deposits d ON d.investor_id = i.id
LEFT JOIN tx t ON t.investor_id = i.id
ORDER BY i.investor_number;

\echo '== 5. Deposits and withdrawals by status'
SELECT 'deposit' AS kind, confirmation_status AS status, count(*), sum(amount) AS total
FROM investor_deposits GROUP BY 2
UNION ALL
SELECT 'withdrawal:' || type, status::text, count(*), sum(amount)
FROM withdrawal_requests GROUP BY 1, 2
ORDER BY 1, 2;

\echo '== 6. Product units funded by investors against physical stock (over-funding check)'
SELECT p.sku, v.sku AS variant_sku,
       coalesce(v.inventory_count, p.inventory_count) AS physical_stock,
       sum(a.quantity_remaining) AS investor_units_remaining,
       count(DISTINCT a.investor_id) AS investors,
       sum(a.quantity_remaining) > coalesce(v.inventory_count, p.inventory_count) AS over_funded
FROM investor_product_allocations a
JOIN products p ON p.id = a.product_id
LEFT JOIN product_variants v ON v.id = a.variant_id
GROUP BY p.sku, v.sku, p.inventory_count, v.inventory_count
ORDER BY over_funded DESC, p.sku;

\echo '== 7. Equipment funding (over 100% check)'
SELECT e.equipment_number, e.status, e.purchase_price, e.current_value,
       count(a.id) FILTER (WHERE NOT a.has_exited) AS active_investors,
       sum(a.amount_allocated) FILTER (WHERE NOT a.has_exited) AS investor_amount,
       sum(a.investment_percentage) FILTER (WHERE NOT a.has_exited) AS investor_percent
FROM equipment e LEFT JOIN investor_equipment_allocations a ON a.equipment_id = e.id
GROUP BY e.id ORDER BY investor_percent DESC NULLS LAST;

\echo '== 8. Equipment jobs recorded'
SELECT count(*) AS jobs, sum(revenue) AS revenue, sum(net_profit) AS net_profit,
       count(*) FILTER (WHERE profit_distributed) AS distributed
FROM equipment_job_usages;

\echo '== 9. Profit distributions, and duplicates (same order, investor, product twice)'
SELECT count(*) AS rows, sum(investor_share) AS investor_share, sum(capital_returned) AS capital_returned
FROM profit_distributions;
SELECT order_id, investor_id, product_id, count(*) AS times
FROM profit_distributions WHERE order_id IS NOT NULL
GROUP BY 1, 2, 3 HAVING count(*) > 1;

\echo '== 10. Orders by payment method and status (card orders were marked paid with no charge)'
SELECT payment_method, payment_status, order_status, is_pos_order, count(*), sum(total_amount) AS total
FROM orders GROUP BY 1, 2, 3, 4 ORDER BY 1, 2, 3, 4;

\echo '== 11. Booking and repair payments'
SELECT 'booking' AS kind, "paymentMethod" AS method, status, count(*), sum(amount) FROM booking_payments GROUP BY 2, 3
UNION ALL
SELECT 'repair', payment_method, payment_type, count(*), sum(amount) FROM repair_payments GROUP BY 2, 3
ORDER BY 1, 2, 3;

\echo '== 12. POS sessions'
SELECT status, count(*), sum(total_sales) AS sales, sum(cash_difference) AS cash_difference
FROM pos_sessions GROUP BY 1;

\echo '== 13. Money amounts with fractions of a franc (must be whole XAF before the ledger)'
SELECT 'investors.cash_balance' AS col, count(*) FROM investors WHERE cash_balance <> trunc(cash_balance)
UNION ALL SELECT 'investors.profit_balance', count(*) FROM investors WHERE profit_balance <> trunc(profit_balance)
UNION ALL SELECT 'investor_transactions.amount', count(*) FROM investor_transactions WHERE amount <> trunc(amount)
UNION ALL SELECT 'profit_distributions.investor_share', count(*) FROM profit_distributions WHERE investor_share <> trunc(investor_share)
UNION ALL SELECT 'orders.total_amount', count(*) FROM orders WHERE total_amount <> trunc(total_amount)
UNION ALL SELECT 'products.price', count(*) FROM products WHERE price <> trunc(price);

\echo '== 14. Negative balances or stock'
SELECT 'investor cash' AS what, count(*) FROM investors WHERE cash_balance < 0
UNION ALL SELECT 'investor profit', count(*) FROM investors WHERE profit_balance < 0
UNION ALL SELECT 'product stock', count(*) FROM products WHERE inventory_count < 0
UNION ALL SELECT 'variant stock', count(*) FROM product_variants WHERE inventory_count < 0;

\echo '== 15. Calendar and apprentice data sizes'
SELECT 'timetable_events' AS t, count(*) FROM timetable_events
UNION ALL SELECT 'calendar_events', count(*) FROM calendar_events
UNION ALL SELECT 'apprentices', count(*) FROM apprentices
UNION ALL SELECT 'apprentice_enrollments', count(*) FROM apprentice_enrollments
UNION ALL SELECT 'app_settings', count(*) FROM app_settings;
