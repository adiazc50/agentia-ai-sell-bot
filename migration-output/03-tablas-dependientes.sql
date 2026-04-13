-- ============================================================
-- MIGRACIÓN SUPABASE → MYSQL (tablas que dependen de usuarios)
-- EJECUTAR DESPUÉS de migrar usuarios y llenar el mapeo
-- Generado: 2026-04-09T20:53:49.786Z
-- ============================================================

-- Para generar estos INSERTs correctamente, necesitas el mapeo
-- de Supabase user_id (UUID) → MySQL user id (int)
-- Ejecuta: SELECT id, email FROM Users; y mapea manualmente

-- No hay user_roles
-- No hay Subscriptions
-- No hay SupportTickets
-- No hay SellerCommissions
