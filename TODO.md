# TODO: Create Drizzle Schema APIs

## Approved Plan Summary
- Create REST APIs for all schema tables using Nuxt Nitro patterns
- Structure: server/api/[group]/[table]/ (GET/POST/[id].*)
- Groups: auth, core, users, organizations, policies, ikk, misc
- CRUD operations with pagination, basic validation, standard responses {success, data/error}
- Reference external repo pattern: https://github.com/pujisubarkah/sik-keuangan/tree/main/server/api (follow similar structure/import utils if possible)
- Phase 1 priority: user, agencies, policy, instansi, role, ikkKiScore, ikkKuScore
- Later: auth middleware, full tables, frontend integration

## Steps (0/15 complete)

### Phase 1: Core Infrastructure
- [ ] 1. Create utils/db.ts with common CRUD helpers (getAll, getById, create, update, delete)
- [ ] 2. Create middleware/auth.ts (optional basic check from event.context.session)
- [ ] 3. Create server/api/test/ping.get.ts to verify DB connection

### Phase 2: Priority Tables APIs
- [x] 4. Group 'users': server/api/users/ (all 5 CRUD ✅ Test: /api/users )
- [x] 5. server/api/core/instansi/ (CRUD ✅ Test: /api/core ) 

- [x] 6. server/api/core/role/ (CRUD ✅ Test: /api/core/role )
- [ ] 7. server/api/core/activeYear/ (CRUD)
- [ ] 8. server/api/organizations/agencies/ (CRUD)
- [ ] 9. server/api/policies/policy/ (CRUD with policyProgram join)
- [ ] 10. server/api/ikk/ikkKiScore/ (CRUD)
- [ ] 11. server/api/ikk/ikkKuScore/ (CRUD)

### Phase 3: Remaining Tables
- [ ] 12. IKK related: ikkFile, ikkCatatan, ikkKnScore, ikkKoornas, ikkVerifikator
- [ ] 13. Misc: helpdesk, suratJfak, etc.
- [ ] 14. Relationships/validation enhancements
- [ ] 15. Test all endpoints, generate types, frontend samples

### Testing
Run `pnpm dev` and test with curl/Postman:
- GET /api/users/user
- POST /api/core/instansi (body data)
 etc.

Update this file as steps complete.
