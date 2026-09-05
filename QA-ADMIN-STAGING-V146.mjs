import fs from 'node:fs';

const read=file=>fs.readFileSync(new URL(file,import.meta.url),'utf8');
const files={
  config:read('./config.js'),auth:read('./auth-client-v6.js'),admin:read('./admin-engine.js'),api:read('./admin-staging-api-v145.js'),
  base:read('./SUPABASE-ADMIN-STAGING-V145.sql'),hardening:read('./SUPABASE-ADMIN-STAGING-V146-HARDENING.sql'),
  atomic:read('./SUPABASE-ADMIN-STAGING-V146-CONSULTATION-ATOMIC.sql'),advisors:read('./SUPABASE-ADMIN-STAGING-V146-ADVISORS.sql'),
  contract:read('./ADMIN-BACKEND-CONTRACT-V146.json')
};

const checks={
  generalBackendStillLocal:/apiBase:''/.test(files.config),
  adminBackendIsStaging:/adminApiBase:'https:\/\/kyphdsamyygavmkzyezr\.supabase\.co\/functions\/v1\/admin-api'/.test(files.config),
  adminTransportSeparated:/this\.adminBase/.test(files.auth)&&/adminEnabled/.test(files.auth),
  csrfVersionMatched:[files.auth,files.api].every(source=>source.includes("x-divina-admin-request")&&source.includes('v146')),
  ownerServerCheck:/from\('admin_owners'\)/.test(files.api),
  verifiedEmail:/email_confirmed_at/.test(files.api),
  mfaAal2:/claims\.aal!=='aal2'/.test(files.api),
  recoveryUsable:/recoverMfa/.test(files.api)&&/adminRecoverMfa/.test(files.auth)&&/recoverMfa/.test(files.admin),
  recoveryOneUse:/used_at/.test(files.api)&&/protect_admin_recovery_code/.test(files.hardening),
  noClientSecrets:!files.config.includes('SUPABASE_SERVICE_ROLE_KEY')&&!files.config.includes('ADMIN_RECOVERY_PEPPER'),
  sixRlsTables:(files.base.match(/enable row level security/g)||[]).length===6,
  sixForcedRls:(files.base.match(/force row level security/g)||[]).length===6,
  explicitDenyPolicies:(files.advisors.match(/as restrictive for all to anon, authenticated/g)||[]).length===6,
  singleOwner:/admin_single_active_owner_idx/.test(files.hardening),
  immutableHistory:/consultation_prices_immutable/.test(files.base),
  atomicPriceChange:/admin_apply_consultation_prices_v146/.test(files.atomic)&&/\.rpc\('admin_apply_consultation_prices_v146'/.test(files.api),
  currentPrices:['25000','15000','10000','5000'].every(value=>files.contract.includes(value)),
  productionLocked:['production_publish_authorized','dns_changes_authorized','real_billing_authorized','store_submission_authorized','ORBE_AI_SOL_ENABLED'].every(flag=>files.contract.includes(`"${flag}":false`))
};

for(const [name,passed] of Object.entries(checks))console.log(`${passed?'PASS':'FAIL'} ${name}`);
if(Object.values(checks).some(passed=>!passed))process.exit(1);
console.log(`PASS ${Object.keys(checks).length}/${Object.keys(checks).length} — ADMIN STAGING V146`);
