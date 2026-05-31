-- Only rank donations confirmed by PhonePe (phonepe_transaction_id present).

CREATE OR REPLACE VIEW donor_leaderboard AS
SELECT
  lower(email::text) || '|' || COALESCE(NULLIF(trim(phone), ''), '') AS donor_key,
  max(donor_name) AS donor_name,
  email,
  phone,
  count(*) FILTER (
    WHERE status = 'success' AND phonepe_transaction_id IS NOT NULL
  ) AS donation_count,
  sum(amount_paise) FILTER (
    WHERE status = 'success' AND phonepe_transaction_id IS NOT NULL
  ) AS total_amount_paise,
  max(created_at) FILTER (
    WHERE status = 'success' AND phonepe_transaction_id IS NOT NULL
  ) AS last_donation_at
FROM donations
GROUP BY email, phone
HAVING sum(amount_paise) FILTER (
  WHERE status = 'success' AND phonepe_transaction_id IS NOT NULL
) > 0
ORDER BY total_amount_paise DESC;
