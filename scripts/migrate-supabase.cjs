/**
 * Script para migrar datos de Supabase a MySQL
 * Genera archivos SQL que puedes ejecutar en tu base de datos.
 *
 * Uso: node scripts/migrate-supabase.js TU_SERVICE_ROLE_KEY
 */

const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://pvwdgfgboptrjliopalc.supabase.co';
const SERVICE_ROLE_KEY = process.argv[2];

if (!SERVICE_ROLE_KEY) {
  console.error('❌ Uso: node scripts/migrate-supabase.js TU_SERVICE_ROLE_KEY');
  console.error('   La service_role key la encuentras en Supabase Dashboard → Settings → API');
  process.exit(1);
}

const headers = {
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
};

async function fetchTable(table, select = '*', orderBy = 'created_at') {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}&order=${orderBy}.asc`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const err = await res.text();
    console.error(`❌ Error fetching ${table}: ${res.status} ${err}`);
    return [];
  }
  const data = await res.json();
  console.log(`✅ ${table}: ${data.length} registros`);
  return data;
}

function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 1 : 0;
  const str = String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return `'${str}'`;
}

function formatDate(val) {
  if (!val) return 'NULL';
  return esc(val.replace('T', ' ').replace('Z', '').substring(0, 19));
}

// ==================== PASO 1: PaypalPlans ====================
function generatePaypalPlans(rows) {
  if (!rows.length) return '-- No hay PaypalPlans\n';
  let sql = '-- ==================== PaypalPlans ====================\n';
  for (const r of rows) {
    sql += `INSERT INTO PaypalPlans (paypalPlanId, paypalProductId, planName, amountUsd, billingPeriod, createdAt)
VALUES (${esc(r.paypal_plan_id)}, ${esc(r.paypal_product_id)}, ${esc(r.plan_name)}, ${r.amount_usd}, ${esc(r.billing_period)}, ${formatDate(r.created_at)});\n`;
  }
  return sql + '\n';
}

// ==================== PASO 2: TrmRates ====================
function generateTrmRates(rows) {
  if (!rows.length) return '-- No hay TrmRates\n';
  let sql = '-- ==================== TrmRates ====================\n';
  for (const r of rows) {
    sql += `INSERT INTO TrmRates (rate, rateWithCommission, source, fetchedAt)
VALUES (${r.rate}, ${r.rate_with_commission}, ${esc(r.source)}, ${formatDate(r.fetched_at)});\n`;
  }
  return sql + '\n';
}

// ==================== PASO 3: Subscriptions ====================
// Necesita mapeo de user_id (Supabase UUID) → idCompany (MySQL int)
function generateSubscriptions(rows, userCompanyMap) {
  if (!rows.length) return '-- No hay Subscriptions\n';
  let sql = '-- ==================== Subscriptions ====================\n';
  sql += '-- NOTA: Verifica que idCompany corresponda al usuario correcto\n';
  let skipped = 0;
  for (const r of rows) {
    const idCompany = userCompanyMap[r.user_id];
    if (!idCompany) {
      sql += `-- SKIP: subscription ${r.id} - user_id ${r.user_id} no encontrado en MySQL\n`;
      skipped++;
      continue;
    }
    sql += `INSERT INTO Subscriptions (idCompany, planName, amount, currency, paymentGateway, status, nextBillingDate, lastBillingDate, retryCount, maxRetries, paypalPlanId, paypalSubscriptionId, wompiCardToken, wompiPaymentSourceId, suspendedAt, createdAt, updatedAt)
VALUES (${idCompany}, ${esc(r.plan_name)}, ${r.amount}, ${esc(r.currency)}, ${esc(r.payment_gateway)}, ${esc(r.status)}, ${formatDate(r.next_billing_date)}, ${formatDate(r.last_billing_date)}, ${r.retry_count}, ${r.max_retries}, ${esc(r.paypal_plan_id)}, ${esc(r.paypal_subscription_id)}, ${esc(r.wompi_card_token)}, ${r.wompi_payment_source_id || 'NULL'}, ${formatDate(r.suspended_at)}, ${formatDate(r.created_at)}, ${formatDate(r.updated_at)});\n`;
  }
  if (skipped) sql += `-- ${skipped} registros omitidos por falta de mapeo de usuario\n`;
  return sql + '\n';
}

// ==================== PASO 4: SupportTickets ====================
function generateSupportTickets(rows, userCompanyMap) {
  if (!rows.length) return '-- No hay SupportTickets\n';
  let sql = '-- ==================== SupportTickets ====================\n';
  // Mapeo de supabase ticket id → mysql auto_increment para TicketMessages
  sql += '-- Los IDs de tickets cambian en MySQL. Ajusta TicketMessages si es necesario.\n';
  let skipped = 0;
  for (const r of rows) {
    const mapping = userCompanyMap[r.user_id];
    if (!mapping) {
      sql += `-- SKIP: ticket ${r.id} - user_id ${r.user_id} no encontrado\n`;
      skipped++;
      continue;
    }
    sql += `INSERT INTO SupportTickets (idUser, idCompany, subject, description, status, priority, createdAt, updatedAt)
VALUES (${mapping.idUser}, ${mapping.idCompany}, ${esc(r.subject)}, ${esc(r.description)}, ${esc(r.status)}, ${esc(r.priority)}, ${formatDate(r.created_at)}, ${formatDate(r.updated_at)});\n`;
  }
  if (skipped) sql += `-- ${skipped} registros omitidos\n`;
  return sql + '\n';
}

// ==================== PASO 5: SellerCommissions ====================
function generateSellerCommissions(rows, userCompanyMap) {
  if (!rows.length) return '-- No hay SellerCommissions\n';
  let sql = '-- ==================== SellerCommissions ====================\n';
  sql += '-- NOTA: idSeller, idUser e idTransaction necesitan mapeo manual\n';
  for (const r of rows) {
    sql += `-- seller_id: ${r.seller_id}, user_id: ${r.user_id}, transaction_id: ${r.transaction_id}\n`;
    sql += `-- INSERT INTO SellerCommissions (idSeller, idUser, idTransaction, planName, planType, transactionAmount, commissionMonth, commissionPercentage, commissionAmount, status, paidAt, notes, createdAt)
-- VALUES (???, ???, ???, ${esc(r.plan_name)}, ${esc(r.plan_type)}, ${r.transaction_amount}, ${r.commission_month}, ${r.commission_percentage}, ${r.commission_amount}, ${esc(r.status)}, ${formatDate(r.paid_at)}, ${esc(r.notes)}, ${formatDate(r.created_at)});\n`;
  }
  return sql + '\n';
}

// ==================== PASO 6: UserRolesConversia ====================
function generateUserRoles(rows, userCompanyMap) {
  if (!rows.length) return '-- No hay user_roles\n';
  let sql = '-- ==================== UserRolesConversia ====================\n';
  const roleMap = { admin: 1, moderator: 2, user: 3, support: 4, vendedor: 5 };
  let skipped = 0;
  for (const r of rows) {
    const mapping = userCompanyMap[r.user_id];
    if (!mapping) {
      sql += `-- SKIP: role para user_id ${r.user_id} (${r.role}) - no encontrado en MySQL\n`;
      skipped++;
      continue;
    }
    const idRole = roleMap[r.role] || 3;
    sql += `INSERT IGNORE INTO UserRolesConversia (idUser, idRoleConversia) VALUES (${mapping.idUser}, ${idRole});\n`;
  }
  if (skipped) sql += `-- ${skipped} registros omitidos\n`;
  return sql + '\n';
}

// ==================== PASO 7: Profiles → Users + Companies ====================
function generateProfiles(profiles) {
  if (!profiles.length) return '-- No hay profiles\n';
  let sql = '-- ==================== USUARIOS (profiles → Users + Companies + Login) ====================\n';
  sql += '-- IMPORTANTE: Solo inserta los que NO existan por email\n';
  sql += '-- Ejecuta cada bloque y verifica antes de continuar\n\n';

  for (const p of profiles) {
    const isPersona = p.account_type === 'persona';
    const companyName = isPersona
      ? `${p.first_name || ''} ${p.last_name || ''}`.trim()
      : (p.company_name || 'Sin nombre');
    const nit = isPersona ? (p.document_number || '') : (p.nit || '');
    const userName = isPersona
      ? [p.first_name, p.second_name, p.last_name, p.second_last_name].filter(Boolean).join(' ')
      : (p.contact_name || companyName);
    const phone = p.phone ? parseInt(p.phone) || 0 : 0;

    sql += `-- Email: ${p.email} | Tipo: ${p.account_type} | user_id Supabase: ${p.user_id}\n`;
    sql += `SET @exists = (SELECT COUNT(*) FROM Users WHERE email = ${esc(p.email)});\n`;
    sql += `-- Solo ejecutar si @exists = 0:\n`;
    sql += `-- INSERT INTO Companies (name, nit, address, phone, entryDate, status) VALUES (${esc(companyName)}, ${esc(nit)}, ${esc(p.address || '')}, ${phone}, ${p.subscription_start_date ? formatDate(p.subscription_start_date) : 'CURDATE()'}, 0);\n`;
    sql += `-- SET @newCompanyId = LAST_INSERT_ID();\n`;
    sql += `-- INSERT INTO Users (name, address, phone, email, idRole, idCompany, status) VALUES (${esc(userName)}, ${esc(p.address || '')}, ${phone}, ${esc(p.email)}, 2, @newCompanyId, 0);\n`;
    sql += `-- SET @newUserId = LAST_INSERT_ID();\n`;
    sql += `-- INSERT INTO Login (idUser, password) VALUES (@newUserId, '$2a$12$placeholder');\n`;
    sql += `-- INSERT IGNORE INTO UserRolesConversia (idUser, idRoleConversia) VALUES (@newUserId, 3);\n`;
    sql += '\n';
  }
  return sql;
}

// ==================== MAIN ====================
async function main() {
  console.log('🔄 Conectando a Supabase...\n');

  // 1. Fetch all tables
  const [profiles, transactions, subscriptions, tickets, ticketMessages, commissions, paypalPlans, trmRates, userRoles] = await Promise.all([
    fetchTable('profiles', '*', 'created_at'),
    fetchTable('transactions', '*', 'created_at'),
    fetchTable('subscriptions', '*', 'created_at'),
    fetchTable('support_tickets', '*', 'created_at'),
    fetchTable('ticket_messages', '*', 'created_at'),
    fetchTable('seller_commissions', '*', 'created_at'),
    fetchTable('paypal_plans', '*', 'created_at'),
    fetchTable('trm_rates', '*', 'fetched_at'),
    fetchTable('user_roles', '*', 'created_at'),
  ]);

  // 2. Build user_id → {idUser, idCompany} map
  // This will need to be filled manually after checking MySQL
  console.log('\n📋 Profiles encontrados:');
  const userCompanyMap = {};
  profiles.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.email} (${p.account_type}) - Supabase user_id: ${p.user_id}`);
    // Placeholder - user needs to fill with actual MySQL IDs
    // userCompanyMap[p.user_id] = { idUser: ???, idCompany: ??? };
  });

  // 3. Generate SQL files
  let sqlTablas = '';
  sqlTablas += '-- ============================================================\n';
  sqlTablas += '-- MIGRACIÓN SUPABASE → MYSQL (tablas independientes)\n';
  sqlTablas += '-- Generado: ' + new Date().toISOString() + '\n';
  sqlTablas += '-- ============================================================\n\n';
  sqlTablas += generatePaypalPlans(paypalPlans);
  sqlTablas += generateTrmRates(trmRates);

  let sqlUsuarios = '';
  sqlUsuarios += '-- ============================================================\n';
  sqlUsuarios += '-- MIGRACIÓN SUPABASE → MYSQL (usuarios / profiles)\n';
  sqlUsuarios += '-- REVISA cada INSERT antes de ejecutar\n';
  sqlUsuarios += '-- Generado: ' + new Date().toISOString() + '\n';
  sqlUsuarios += '-- ============================================================\n\n';
  sqlUsuarios += generateProfiles(profiles);

  let sqlDependientes = '';
  sqlDependientes += '-- ============================================================\n';
  sqlDependientes += '-- MIGRACIÓN SUPABASE → MYSQL (tablas que dependen de usuarios)\n';
  sqlDependientes += '-- EJECUTAR DESPUÉS de migrar usuarios y llenar el mapeo\n';
  sqlDependientes += '-- Generado: ' + new Date().toISOString() + '\n';
  sqlDependientes += '-- ============================================================\n\n';
  sqlDependientes += '-- Para generar estos INSERTs correctamente, necesitas el mapeo\n';
  sqlDependientes += '-- de Supabase user_id (UUID) → MySQL user id (int)\n';
  sqlDependientes += '-- Ejecuta: SELECT id, email FROM Users; y mapea manualmente\n\n';
  sqlDependientes += generateUserRoles(userRoles, userCompanyMap);
  sqlDependientes += generateSubscriptions(subscriptions, userCompanyMap);
  sqlDependientes += generateSupportTickets(tickets, userCompanyMap);
  sqlDependientes += generateSellerCommissions(commissions, userCompanyMap);

  // Also dump raw JSON for reference
  const rawData = { profiles, transactions, subscriptions, tickets, ticketMessages, commissions, paypalPlans, trmRates, userRoles };

  const outDir = path.join(__dirname, '..', 'migration-output');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  fs.writeFileSync(path.join(outDir, '01-tablas-independientes.sql'), sqlTablas);
  fs.writeFileSync(path.join(outDir, '02-usuarios.sql'), sqlUsuarios);
  fs.writeFileSync(path.join(outDir, '03-tablas-dependientes.sql'), sqlDependientes);
  fs.writeFileSync(path.join(outDir, 'raw-data.json'), JSON.stringify(rawData, null, 2));

  console.log('\n✅ Archivos generados en migration-output/');
  console.log('   01-tablas-independientes.sql  → PaypalPlans, TrmRates (ejecutar primero)');
  console.log('   02-usuarios.sql               → Profiles → Users + Companies (revisar antes de ejecutar)');
  console.log('   03-tablas-dependientes.sql     → Roles, Subscriptions, Tickets, Commissions');
  console.log('   raw-data.json                  → Datos crudos de Supabase para referencia');
  console.log('\n📌 Pasos:');
  console.log('   1. Ejecuta 01-tablas-independientes.sql');
  console.log('   2. Revisa 02-usuarios.sql, descomenta los que no existan y ejecuta');
  console.log('   3. Mapea user_id de Supabase → id de MySQL');
  console.log('   4. Ajusta y ejecuta 03-tablas-dependientes.sql');
}

main().catch(console.error);
