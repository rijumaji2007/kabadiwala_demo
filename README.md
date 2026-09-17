# Kabadiwala Connect — Integrated Demo Platform (Steps 1–4)

Kabadiwala Connect is a Next.js, TypeScript, and Tailwind platform for household pickup, collector operations, administration, and formal-recycling traceability. The checked-in application is a clearly separated browser-local **DEMO MODE** that demonstrates the connected workflow without presenting unconfigured providers as live services.

The public website is available at `/`; private role workspaces remain at `/customer`, `/collector`, `/admin`, and `/recycler`.

## Implemented customer and collector demo scope

- Customer and collector responsive mobile/desktop shells
- Customer and collector registration, login, profile, settings, onboarding, availability, and verification-state UI
- Browser-local **DEMO MODE** sessions (not Firebase Authentication)
- A shared customer → collector demo request workflow: request, accept, travel, arrive, collect, weigh, calculate sample rate, complete, and view demo receipt
- Collector dashboard, requests, one-time location/navigation hand-off, active pickup, collection, weight, price, completion, transactions, earnings, notifications, service area, and help screens
- Separate Admin command center and Recycler partner workspaces, with separate local sessions and permissions in the UI
- Admin monitoring for collectors, verification states, pickup requests, transactions, recycling batches, analytics, reports, notifications, prices, recyclers, and audit records
- Recycler organization application, verification-state UI, available-material batches, receipt/processing/recycling state transitions, history, and material analytics
- Shared formal-recycling batch records derived from completed collector demo transactions
- English, Hindi, and Bengali collector/customer navigation labels
- Centralized sample-only price service and explicit non-payment receipt language
- Clear empty, error, and not-yet-connected states

## Step 4 additions

- A reusable AI classification service boundary (`services/ai/wasteClassificationService.ts`). It calls an optional protected endpoint and otherwise provides an explicitly labelled filename-only **demo fallback**, never a claim of real image AI.
- Customer photo preview, removal, classification review, manual-category confirmation, configurable low-confidence warning, and browser-local future-training feedback records.
- One-time, permission-based browser GPS capture for customer and collector. It does not start continuous tracking, create a fake map location, or calculate an unconfigured route/ETA.
- Transparent smart collector matching by verification, availability, material fit, and active demo workload. Distance is deliberately unavailable until permitted locations and a routing provider are connected.
- Request priorities, idempotency keys for demo create/complete operations, a visible browser-local pending-sync queue, and event-based browser-local notifications.
- Extended recycling traceability with controlled stages: ready for recycler → assigned → in transit → received → processing → recycled → completed. Recycler processing records input, recovered output, rejected material, and calculated loss without hiding discrepancies.
- Admin data-derived analytics, AI-feedback analytics, and a configuration-only System Health page.
- Firebase deployment configuration: Firestore indexes, tighter Firestore role rules for AI feedback, and private Firebase Storage rules for pickup images and collector evidence.

## Final product polish

- Public home, About, How It Works, audience pages, impact, FAQ, contact/support, privacy starter notice, terms starter page, and accessibility page
- Responsive public navigation, application icon, web manifest, sitemap, robots policy, branded 404, and safe error screen
- Customer pickup cancellation that records actor, reason, and timestamp instead of deleting the record
- Admin notification inbox and filterable browser-demo CSV report export
- Recycler notification inbox and controlled batch event notifications
- Browser speech-recognition helper with manual-review fallback; voice never submits a workflow action automatically
- Navigation fixes for real customer transaction/receipt history and collector navigation

### Important Step 4 limitation

This repository still runs in **browser-local demo mode**. Firebase Authentication, Firestore writes, Storage uploads, a Cloud Function/API classification endpoint, production notifications, payment provider, and cross-device offline synchronization cannot work until a real Firebase project, SDK/repository layer, Cloud Functions, and secrets are configured. The code shows accurate “needs setup” / “demo fallback” status rather than pretending those external services are live.

## Run locally

1. Install Node.js 20.9 or newer (Node 22 LTS is recommended).
2. In this folder, run `pnpm install`.
3. Run pnpm run lint and pnpm run typecheck.
4. Run pnpm run dev.
5. Open http://localhost:3000.

Use any email/mobile and password on either login page to start a clearly labelled browser-local demo session. Registering saves the entered display name locally.

### Step 2 demo flow

1. Create a customer pickup at /customer/request-pickup.
2. Log in at /collector/login.
3. Open the request list, accept the new request, then proceed through active pickup, navigation, collection, weight, price, and completion.
4. Re-open the customer pickup status/transactions pages to view the shared demo record and receipt.

The customer and collector flows share one browser-local store; they do not synchronize across devices or user accounts.

### Step 3 demo flow

1. Complete a collector pickup, which creates a demo transaction.
2. Open /admin/login and use admin@kabadiwala.demo with password demo12345.
3. Review the transaction and the derived batch in Admin → Recycling Batches.
4. Register a recycler at /recycler/register, then accept the batch from Available Material.
5. Move the assigned batch through Assigned → In Transit → Received → Processing. Record input/recovered/rejected output, then complete it.

Admin and Recycler sessions remain separate. The recycler UI never exposes Admin navigation or management actions.

### Step 4 end-to-end demo flow

1. Log in as a customer and open `/customer/request-pickup`.
2. Choose material, upload a test image, select **Classify photo**, and confirm/correct the selected category. The fallback must visibly say it is not real AI unless `NEXT_PUBLIC_AI_CLASSIFICATION_ENDPOINT` is configured.
3. On location, select **Share current location** and grant or decline browser permission. Manual address still works either way.
4. Save the request and open `/customer/nearby-collectors` to see transparent collector matching (not fake distances).
5. Log into `/collector/login`, accept the request, move it through navigation, collection, verified weight, central rate calculation, and completion.
6. Check Customer and Collector Notifications, Customer Transactions/Receipt, then `/admin/analytics` and `/admin/ai-analytics`.
7. Log into a recycler. Accept the derived batch, progress the controlled stages, record processing output, then mark it complete. Inspect `/admin/recycling-batches` and `/admin/analytics`.
8. Open `/admin/system-health` to see exactly which external integrations remain unconfigured.

## Build check

Run `pnpm run lint`, `pnpm run typecheck`, and `pnpm run build` before deployment.

## Firebase / AI deployment setup

1. Copy `.env.example` to `.env.local` and set the Firebase public web values. Add `NEXT_PUBLIC_AI_CLASSIFICATION_ENDPOINT` only for a protected API/Cloud Function endpoint; never expose a provider secret in a `NEXT_PUBLIC_` variable.
2. Install and initialize the Firebase client SDK, then replace the demo repositories under `services/` with Firebase-backed repositories. Keep server-only transaction creation, receipts, batch creation, notification delivery, claims, and status-transition validation in Cloud Functions/Admin SDK.
3. Assign `customer`, `collector`, `recycler`, and `admin` custom claims using trusted Firebase Admin code. Do not infer authority from a profile document or from the frontend.
4. Install Firebase CLI, authenticate, choose the existing Firebase project, then run `firebase deploy --only firestore:rules,firestore:indexes,storage`. The included `firebase.json` points at the rules and index files.
5. Review and test `firebase/firestore.rules` and `firebase/storage.rules` in the Firebase Emulator Suite against the final schema before deploying. Rules alone cannot enforce all multi-document financial or workflow invariants; use Cloud Functions for those.

Required public variables are documented in `.env.example`. No additional npm package is required for the current demo. Production Firebase integration will require the `firebase` package plus Firebase CLI for deployment.

### Install Firebase after resolving local package permissions

The current workstation prevented `pnpm add firebase` because Windows denied modification of an existing package inside `node_modules`. Once that is resolved, run:

```powershell
pnpm add firebase
pnpm add -D firebase-tools
```

Then create a Firebase client initializer using the public web values in `.env.local`; keep Admin SDK credentials and all privileged operations in Cloud Functions or another trusted server environment.

## Role / permission matrix

| Role | Allowed records in production |
| --- | --- |
| Customer | Own profile, own pickup requests, own transactions/receipts, own notifications, own classification feedback |
| Collector | Own profile, eligible pending requests, assigned pickups, own transactions/ledger, own notifications |
| Recycler | Own organization profile, batches ready for a recycler or assigned to that recycler, own processing records/notifications |
| Admin | Authorized administration, verification, prices/materials, records, analytics, reports, audit logs, and system-health views |

The browser UI protects demo routes for usability, but production enforcement must come from Firebase Auth custom claims, Firestore/Storage rules, and Cloud Functions. See `firebase/firestore.rules`, `firebase/storage.rules`, and `lib/firebase/README.md`.

## Production deployment checklist

1. Resolve the Firebase SDK installation issue and set every required `.env.local` value.
2. Implement the Firebase repositories/Cloud Functions indicated by the service-boundary documentation; migrate no existing production data automatically.
3. Create trusted custom claims, test the rules in the Emulator Suite, and deploy rules/indexes/storage:

   ```powershell
   firebase login
   firebase use YOUR_EXISTING_PROJECT_ID
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```

4. Add the private server-side AI key to your host or Cloud Functions secret manager; never add it to `NEXT_PUBLIC_*`.
5. Configure a real support endpoint, notification provider, and optional payment provider. Do not collect card details in this app.
6. Set `NEXT_PUBLIC_APP_URL` to the production HTTPS domain; update the privacy/terms pages after legal review.
7. Run `pnpm run lint`, `pnpm run typecheck`, and `pnpm run build` in an environment where Next.js subprocesses and package installation are permitted.
8. Deploy the Next.js app to a host such as Vercel, Firebase App Hosting, or another Node-compatible platform; set the same public environment variables there.

## Data safety notes

- Do not use browser-local demo records as production data or a backup.
- Use scheduled Firestore exports or another approved backup policy for production records; document retention and restoration ownership before launch.
- Completed financial/ledger records, audit logs, transactions, and recycling outputs should be append-only or correction-driven through a trusted backend, never silently overwritten.
