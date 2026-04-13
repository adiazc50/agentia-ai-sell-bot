-- ============================================================
-- MIGRACIÓN SUPABASE → MYSQL (tablas independientes)
-- Generado: 2026-04-09T20:53:49.785Z
-- ============================================================

-- ==================== PaypalPlans ====================
INSERT INTO PaypalPlans (paypalPlanId, paypalProductId, planName, amountUsd, billingPeriod, createdAt)
VALUES ('P-3RN32240C8045573FNGYFVHQ', 'PROD-6R960792AW5475805', 'Plan Test', 0.39, 'mensual', '2026-03-10 17:53:35');
INSERT INTO PaypalPlans (paypalPlanId, paypalProductId, planName, amountUsd, billingPeriod, createdAt)
VALUES ('P-8AJ565557V481050GNGYGEHI', 'PROD-6R960792AW5475805', 'Plan test', 29.9, 'mensual', '2026-03-10 18:25:33');
INSERT INTO PaypalPlans (paypalPlanId, paypalProductId, planName, amountUsd, billingPeriod, createdAt)
VALUES ('P-1VV05136X0444504CNGYYUMA', 'PROD-6R960792AW5475805', 'Starter', 15, 'mensual', '2026-03-11 15:28:48');
INSERT INTO PaypalPlans (paypalPlanId, paypalProductId, planName, amountUsd, billingPeriod, createdAt)
VALUES ('P-5DE17596465271401NGY34VA', 'PROD-6R960792AW5475805', 'test', 1, 'mensual', '2026-03-11 19:11:16');

-- ==================== TrmRates ====================
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3688.46, 3835.9984, 'datos.gov.co', '2026-03-26 00:00:00');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3688.46, 3835.9984, 'datos.gov.co', '2026-03-26 12:00:01');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3675.29, 3822.3016000000002, 'datos.gov.co', '2026-03-27 00:00:01');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3675.29, 3822.3016000000002, 'datos.gov.co', '2026-03-27 12:00:00');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3668.89, 3815.6456, 'datos.gov.co', '2026-03-28 00:00:04');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3668.89, 3815.6456, 'datos.gov.co', '2026-03-28 12:00:02');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3668.89, 3815.6456, 'datos.gov.co', '2026-03-29 00:00:05');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3668.89, 3815.6456, 'datos.gov.co', '2026-03-29 12:00:00');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3668.89, 3815.6456, 'datos.gov.co', '2026-03-30 00:00:02');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3668.89, 3815.6456, 'datos.gov.co', '2026-03-30 12:00:02');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3669.96, 3816.7584, 'datos.gov.co', '2026-03-31 00:00:01');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3669.96, 3816.7584, 'datos.gov.co', '2026-03-31 12:00:03');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3660.1, 3806.504, 'datos.gov.co', '2026-04-01 00:00:00');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3660.1, 3806.504, 'datos.gov.co', '2026-04-01 12:00:01');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3675.81, 3822.8424, 'datos.gov.co', '2026-04-02 00:00:01');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3675.81, 3822.8424, 'datos.gov.co', '2026-04-02 12:00:01');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3675.81, 3822.8424, 'datos.gov.co', '2026-04-03 00:00:00');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3675.81, 3822.8424, 'datos.gov.co', '2026-04-03 12:00:00');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3675.81, 3822.8424, 'datos.gov.co', '2026-04-04 00:00:01');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3675.81, 3822.8424, 'datos.gov.co', '2026-04-04 12:00:01');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3675.81, 3822.8424, 'datos.gov.co', '2026-04-05 00:00:03');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3675.81, 3822.8424, 'datos.gov.co', '2026-04-05 12:00:03');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3675.81, 3822.8424, 'datos.gov.co', '2026-04-06 00:00:00');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3675.81, 3822.8424, 'datos.gov.co', '2026-04-06 12:00:00');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3664.41, 3810.9864, 'datos.gov.co', '2026-04-07 00:00:01');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3664.41, 3810.9864, 'datos.gov.co', '2026-04-07 12:00:03');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3678.19, 3825.3176000000003, 'datos.gov.co', '2026-04-08 00:00:01');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3678.19, 3825.3176000000003, 'datos.gov.co', '2026-04-08 12:00:01');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3640.63, 3786.2552, 'datos.gov.co', '2026-04-09 00:00:01');
INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (3640.63, 3786.2552, 'datos.gov.co', '2026-04-09 12:00:00');

