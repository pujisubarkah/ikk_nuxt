# TODO: Convert server/api/instansi/ to Nuxt/Nitro (from Next.js/Prisma)

## Plan Steps (Approved by User)

### 1. ✅ Create this TODO.md for tracking

### 2. Convert core files one-by-one (update this file after each)

- [✅] server/api/instansi/index.ts (POST/GET agencies -> Drizzle)
- [✅] server/api/instansi/panrb/index.ts (GET instansi)
- [✅] server/api/instansi/policy/index.ts (GET instansi + policy)
- [✅] server/api/instansi/[id]/instansi.ts (GET agency_name)
- [✅] server/api/instansi/[id]/agency.ts
   - [ ] server/api/instansi/[id]/kebijakan-diajukan.ts
   - [ ] server/api/instansi/[id]/kebijakan-diproses.ts
   - [ ] server/api/instansi/[id]/pilih-verifikator.ts
   - [ ] server/api/instansi/policy/[agency_id]/index.ts

### 3. Read & Align Schemas if queries fail
   - [ ] server/db/schema/organization.ts
   - [ ] server/db/schema/policy.ts
   - [ ] server/db/schema/ikk.ts (if relevant)

### 4. Test & Verify
   - [ ] Run `nuxt dev`
   - [ ] Test endpoints (e.g., curl POST/GET /api/instansi)
   - [ ] Fix any Drizzle errors

### 5. Completion
   - [ ] Update types/server-db.d.ts if needed
   - [ ] attempt_completion

