# inversify-service

Express + Inversify IoC project with the same structure as `payment-engine`.

## Structure

- **config/** – `inversifyTypes.ts` (TYPES symbols), `container.ts` (bindings)
- **controllers/** – `BaseController`, controllers with `@controller` and `@httpGet`/`@httpPost` etc.
- **services/** – `BaseService`, injectable services
- **constants/** – HTTP status and app constants
- **utils/** – `AppError`
- **server.ts** – Express + InversifyExpressServer, middleware, error handling

## Scripts

- `npm run dev` – run with ts-node-dev
- `npm run build` – compile TypeScript
- `npm start` – run compiled `dist/server.js`

## Add a new feature (same as payment-engine)

1. Add symbols in `config/inversifyTypes.ts`
2. Create service in `services/` (extend `BaseService`, `@injectable()`)
3. Create controller in `controllers/` (inject service, use `TYPES.*`)
4. Bind in `config/container.ts`
5. Import controller in `server.ts` so it is registered
