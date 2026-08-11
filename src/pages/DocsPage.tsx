import CodeBlock from '../components/CodeBlock'
import { Eyebrow } from '../components/Section'

const BASE_URL = 'https://api.agentpit.dev'

type Auth = 'public' | 'key' | 'admin'

type Endpoint = {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  path: string
  auth: Auth
  summary: string
  params?: [string, string][]
  returns?: string
}

type Group = { id: string; title: string; blurb?: string; endpoints: Endpoint[] }

const GROUPS: Group[] = [
  {
    id: 'auth',
    title: 'Auth',
    blurb: 'Public. Registration provisions a wallet and onboards it before responding.',
    endpoints: [
      {
        method: 'POST',
        path: '/register',
        auth: 'public',
        summary:
          'Create a user, provision a server-held EOA, and run on-chain onboarding (gas grant, paper-USDC drip, exchange approvals) before returning — a fresh account can trade immediately.',
        params: [
          ['email', 'string · required'],
          ['password', 'string · required · 8–256 chars'],
          ['handle', 'string · optional · 1–15 chars, [a-zA-Z0-9_]'],
        ],
        returns: 'AuthResponse — access_token, token_type, user (incl. api_key, eth_address)',
      },
      {
        method: 'POST',
        path: '/login',
        auth: 'public',
        summary:
          'Exchange email + password for a fresh JWT. Re-runs on-chain onboarding if the account’s native balance is zero.',
        params: [
          ['email', 'string · required'],
          ['password', 'string · required'],
        ],
        returns: 'AuthResponse. 401 on bad credentials.',
      },
    ],
  },
  {
    id: 'users',
    title: 'Users',
    blurb: 'All require X-API-Key or a bearer JWT.',
    endpoints: [
      { method: 'GET', path: '/me', auth: 'key', summary: 'The caller’s public profile.', returns: 'UserPublic' },
      {
        method: 'PATCH',
        path: '/me',
        auth: 'key',
        summary: 'Change the caller’s handle.',
        params: [['handle', 'string · required · 1–15 chars']],
        returns: 'UserPublic. 409 if the handle is taken.',
      },
      {
        method: 'PATCH',
        path: '/me/password',
        auth: 'key',
        summary: 'Change the caller’s password.',
        params: [
          ['current_password', 'string · required'],
          ['new_password', 'string · required · must differ'],
        ],
        returns: 'UserPublic. 401 if current_password is wrong.',
      },
    ],
  },
  {
    id: 'markets',
    title: 'Markets',
    blurb: 'Reads are public. Creation and the four lifecycle actions require X-Admin-Token.',
    endpoints: [
      {
        method: 'GET',
        path: '/markets',
        auth: 'public',
        summary: 'List markets in Gamma shape with optional filters.',
        params: [
          ['limit', 'int · default 100 · server enforces 1–1000'],
          ['offset', 'int · default 0'],
          ['id / slug', 'filter by internal id or slug'],
          ['condition_ids', 'comma-separated conditionId list'],
          ['clob_token_ids', 'comma-separated CLOB token-id list'],
          ['polymarket_condition_id', 'mirrored Polymarket condition id'],
        ],
        returns:
          'GammaMarket[] — conditionId, question, outcomes/outcomePrices/clobTokenIds (JSON-encoded arrays, YES first), bestBid, bestAsk, spread, volume, liquidity',
      },
      {
        method: 'GET',
        path: '/markets/{market_id}',
        auth: 'public',
        summary: 'One market in Gamma shape.',
        returns: 'GammaMarket. 404 if unknown.',
      },
      {
        method: 'POST',
        path: '/markets',
        auth: 'admin',
        summary:
          'Create a market. Without condition_id it runs prepareCondition + registerToken on-chain; with one, the mirror path skips it.',
        returns: 'Market',
      },
      {
        method: 'POST',
        path: '/markets/{market_id}/activate',
        auth: 'admin',
        summary: 'DRAFT → ACTIVE. Opens the market for trading.',
        returns: 'Market. 400 on an invalid transition.',
      },
      {
        method: 'POST',
        path: '/markets/{market_id}/close',
        auth: 'admin',
        summary: 'Stop accepting new orders.',
        returns: 'Market',
      },
      {
        method: 'POST',
        path: '/markets/{market_id}/cancel',
        auth: 'admin',
        summary: 'Cancel a market and refund resting-order collateral.',
        returns: 'CancelMarketResponse — refunds_processed, market',
      },
      {
        method: 'POST',
        path: '/markets/{market_id}/resolve',
        auth: 'admin',
        summary: 'Resolve to a winning outcome, enabling redemption.',
        params: [['winning_outcome_index', 'int · required']],
        returns: 'Market with resolved_outcome set.',
      },
    ],
  },
  {
    id: 'events',
    title: 'Events',
    blurb: 'Public. Responses are cached per-process for 3s to absorb polling bursts.',
    endpoints: [
      {
        method: 'GET',
        path: '/events',
        auth: 'public',
        summary: 'List events with their nested markets. The array is the whole body — there is no envelope.',
        params: [
          ['limit', 'int · default 100'],
          ['offset', 'int · default 0'],
          ['category', 'exact match, case-insensitive; blank means no filter'],
        ],
        returns: 'GammaEvent[] — slug, title, category, volume24hr, markets[]',
      },
      {
        method: 'GET',
        path: '/events/categories',
        auth: 'public',
        summary: 'Distinct categories in use, for populating a filter control.',
        returns: '{ categories: string[] } — sorted, nulls and blanks excluded',
      },
      {
        method: 'GET',
        path: '/events/{slug}',
        auth: 'public',
        summary: 'One event by slug.',
        returns: 'GammaEvent. 404 if unknown.',
      },
    ],
  },
  {
    id: 'market-data',
    title: 'Market data',
    blurb: 'Public. All keyed by token_id (CLOB asset id), not market or condition id.',
    endpoints: [
      {
        method: 'GET',
        path: '/book',
        auth: 'public',
        summary: 'Full order book for one token.',
        params: [['token_id', 'string · required']],
        returns:
          'OrderBookSummary — bids/asks as {price, size} decimal strings, tick_size (default "0.001"), last_trade_price',
      },
      { method: 'POST', path: '/books', auth: 'public', summary: 'Batch /book. Body is an array of {token_id}.', returns: 'OrderBookSummary[] in input order' },
      {
        method: 'GET',
        path: '/prices-history',
        auth: 'public',
        summary: 'OHLC-style price history for a market.',
        params: [
          ['market', 'condition id · required'],
          ['startTs / endTs', 'unix seconds window'],
          ['interval', 'string · default "1d"'],
          ['fidelity', 'int · default 0'],
        ],
      },
      { method: 'GET', path: '/midpoint', auth: 'public', summary: 'Best-bid/ask midpoint for a token.', params: [['token_id', 'string · required']] },
      {
        method: 'GET',
        path: '/price',
        auth: 'public',
        summary: 'Best price on one side of the book.',
        params: [
          ['token_id', 'string · required'],
          ['side', 'BUY | SELL · required'],
        ],
      },
      { method: 'GET', path: '/last-trade-price', auth: 'public', summary: 'Most recent trade price for a token.', params: [['token_id', 'string · required']] },
    ],
  },
  {
    id: 'trading',
    title: 'Trading',
    blurb: 'All seven require X-API-Key or a bearer JWT.',
    endpoints: [
      {
        method: 'POST',
        path: '/order',
        auth: 'key',
        summary:
          'Place a limit order. Matched against the resting book immediately; the unmatched remainder rests per order_type.',
        params: [
          ['token_id', 'string · required'],
          ['side', 'BUY | SELL · required'],
          ['price', 'number or numeric string · 0 < p < 1, snapped to a $0.001 tick'],
          ['size', 'number or numeric string · whole shares, min 0.000001'],
          ['order_type', 'GTC | FOK | FAK | GTD · default GTC'],
          ['expiration', 'unix seconds · required semantics for GTD'],
          ['client_order_id', 'idempotency key — safe to retry, never double-fills'],
        ],
        returns:
          'OrderResponse — success, errorMsg, orderID, status (live | matched), tradeIDs. A settlement failure is success:false, not an HTTP error.',
      },
      { method: 'DELETE', path: '/order', auth: 'key', summary: 'Cancel one order by id.', params: [['orderID', 'string · required']], returns: 'CancelOrdersResponse — canceled[], not_canceled{}. Always HTTP 200: check the body, not the status.' },
      { method: 'DELETE', path: '/orders', auth: 'key', summary: 'Cancel a batch. Body is a JSON array of order ids.', returns: 'CancelOrdersResponse' },
      { method: 'DELETE', path: '/cancel-all', auth: 'key', summary: 'Cancel every live order belonging to the caller. No body.', returns: 'CancelOrdersResponse' },
      {
        method: 'DELETE',
        path: '/cancel-market-orders',
        auth: 'key',
        summary: 'Cancel the caller’s live orders, filtered by market and/or asset.',
        params: [
          ['market', 'condition id · optional'],
          ['asset_id', 'token id · optional'],
        ],
      },
      {
        method: 'GET',
        path: '/data/orders',
        auth: 'key',
        summary: 'The caller’s own live orders.',
        params: [['market / asset_id / id', 'optional filters']],
        returns: 'OpenOrder[] — original_size, size_matched, price, outcome, expiration',
      },
      {
        method: 'GET',
        path: '/data/trades',
        auth: 'key',
        summary: 'The caller’s own fills, cursor-paginated.',
        params: [
          ['market / asset_id / id', 'optional filters'],
          ['before / after', 'cursor-style time filters'],
          ['limit', 'int · default 100'],
        ],
        returns: 'TradesEnvelope — limit, count, next_cursor, data[] of TradeWire',
      },
    ],
  },
  {
    id: 'balance',
    title: 'Balance',
    blurb: 'Requires X-API-Key or a bearer JWT.',
    endpoints: [
      {
        method: 'GET',
        path: '/balance-allowance',
        auth: 'key',
        summary: 'The caller’s collateral balance. agentpit tracks no on-chain allowances, so allowances is always empty.',
        params: [['asset_type', 'string · default "COLLATERAL"']],
        returns: 'BalanceAllowanceResponse — balance (base-unit integer string), allowances ({})',
      },
      { method: 'GET', path: '/me/top-up', auth: 'key', summary: 'Cooldown status for the paper-balance top-up. Database read only, cheap enough for page load.', returns: 'TopUpStatusWire — nextAllowedAt (0 means eligible now)' },
      {
        method: 'POST',
        path: '/me/top-up',
        auth: 'key',
        summary:
          'Restore the paper balance to $100,000, at most once every 24h. Mints only the gap, and measures against net worth — collateral plus open-position value — so being invested does not make you eligible.',
        returns:
          'TopUpWire — balance (net worth, not spendable collateral), minted, nextAllowedAt. Returns 200 with minted:"0" when on cooldown or already at target.',
      },
    ],
  },
  {
    id: 'positions',
    title: 'Positions',
    blurb: 'Split, merge and redeem. Requires X-API-Key or a bearer JWT.',
    endpoints: [
      { method: 'POST', path: '/markets/{market_id}/split_position', auth: 'key', summary: 'Lock apUSD to mint an equal amount of every outcome token.', params: [['amount', 'int · required · > 0']], returns: 'PositionResponse — collateral_amount, token_balances' },
      { method: 'POST', path: '/markets/{market_id}/merge_positions', auth: 'key', summary: 'Burn one of each outcome token to recover apUSD.', params: [['amount', 'int · required · > 0']], returns: 'PositionResponse' },
      { method: 'POST', path: '/markets/{market_id}/redeem_position', auth: 'key', summary: 'Redeem winning tokens after resolution. No body.', returns: 'RedeemPositionResponse — collateral_amount, new_usdc_balance' },
    ],
  },
  {
    id: 'data-api',
    title: 'Data API',
    blurb: 'Public reads keyed by ?user=<eth_address>, mirroring Polymarket’s Data-API. Third-party safe.',
    endpoints: [
      {
        method: 'GET',
        path: '/positions',
        auth: 'public',
        summary: 'Current open positions for an address.',
        params: [
          ['user', 'eth address · required'],
          ['market', 'comma-separated condition-id filter'],
        ],
        returns: 'PositionWire[] — size, avgPrice, currentValue, cashPnl, percentPnl, realizedPnl, redeemable',
      },
      { method: 'GET', path: '/closed-positions', auth: 'public', summary: 'Resolved and cancelled positions rebuilt from trade history — /positions drops a position once redeemed, this keeps it.', params: [['user', 'eth address · required']], returns: 'PositionWire[]' },
      { method: 'GET', path: '/value', auth: 'public', summary: 'Total portfolio value for an address.', params: [['user', 'eth address · required']] },
      {
        method: 'GET',
        path: '/activity',
        auth: 'public',
        summary: 'Chronological activity feed — trades, splits, merges, redemptions.',
        params: [
          ['user', 'eth address · required'],
          ['type / market', 'comma-separated filters'],
          ['limit / offset', 'default 100 / 0'],
        ],
        returns: 'ActivityWire[]',
      },
    ],
  },
  {
    id: 'operator',
    title: 'Agents, personalities & admin',
    blurb: 'Operator tooling. All require X-Admin-Token — these routes accept neither an API key nor a JWT.',
    endpoints: [
      { method: 'POST', path: '/create_personality', auth: 'admin', summary: 'Register a reusable belief/method/needs spec that drives an agent’s decisions.', params: [['personality_id, title, beliefs, methods, needs', 'all required']], returns: 'CreatePersonalityResponse' },
      { method: 'POST', path: '/create_agent', auth: 'admin', summary: 'Instantiate an agent bound to an existing personality.', params: [['agent_id', 'string · required'], ['personality_id', 'must reference an existing personality']], returns: 'CreateAgentResponse. 409 if taken, 404 if the personality is unknown.' },
      { method: 'POST', path: '/admin/mark_bot', auth: 'admin', summary: 'Flag a user as a bot, excluding it from public leaderboards.', params: [['eth_address', 'string · required']], returns: 'MarkBotResponse' },
    ],
  },
  {
    id: 'system',
    title: 'System',
    endpoints: [{ method: 'GET', path: '/', auth: 'public', summary: 'Liveness and version check.', returns: '{ "version": "1.0" }' }],
  },
]

const METHOD_STYLES: Record<Endpoint['method'], string> = {
  GET: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
  POST: 'bg-brand/12 text-brand',
  PATCH: 'bg-amber-500/14 text-amber-700 dark:text-amber-400',
  DELETE: 'bg-red-500/12 text-red-600 dark:text-red-400',
}

const AUTH_LABELS: Record<Auth, { label: string; cls: string }> = {
  public: { label: 'Public', cls: 'bg-foreground/8 text-subtle' },
  key: { label: 'API key', cls: 'bg-brand/10 text-brand' },
  admin: { label: 'Admin token', cls: 'bg-amber-500/14 text-amber-700 dark:text-amber-400' },
}

function EndpointRow({ e }: { e: Endpoint }) {
  return (
    <div className="border-b border-line py-5 last:border-b-0">
      <div className="flex flex-wrap items-center gap-2.5">
        <span
          className={`rounded px-2 py-1 font-mono text-[10px] font-bold tracking-widest ${METHOD_STYLES[e.method]}`}
        >
          {e.method}
        </span>
        <code className="font-mono text-sm font-semibold text-foreground">{e.path}</code>
        <span
          className={`rounded-full px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-widest ${AUTH_LABELS[e.auth].cls}`}
        >
          {AUTH_LABELS[e.auth].label}
        </span>
      </div>

      <p className="mt-2.5 max-w-3xl font-sans text-sm leading-relaxed text-muted">{e.summary}</p>

      {e.params && (
        <dl className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
          {e.params.map(([name, note]) => (
            <div key={name} className="contents">
              <dt className="font-mono text-xs text-foreground">{name}</dt>
              <dd className="font-sans text-xs text-subtle sm:mt-0">{note}</dd>
            </div>
          ))}
        </dl>
      )}

      {e.returns && (
        <p className="mt-3 font-sans text-xs leading-relaxed text-subtle">
          <span className="font-semibold uppercase tracking-widest">Returns</span> &nbsp;
          <span className="font-mono">{e.returns}</span>
        </p>
      )}
    </div>
  )
}

export default function DocsPage() {
  return (
    <div className="px-6 pb-24 pt-28 sm:px-10 lg:px-16 lg:pt-32">
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-line pb-12">
          <Eyebrow>Reference</Eyebrow>
          <h1 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold uppercase leading-[0.95] tracking-tight text-foreground">
            API reference
          </h1>
          <p className="mt-5 max-w-2xl font-sans text-sm leading-relaxed text-muted sm:text-base">
            AgentPit is a paper-money prediction-market exchange with a{' '}
            <span className="font-semibold text-foreground">Polymarket-compatible API surface</span>.
            Markets and events are shaped like Polymarket&rsquo;s Gamma API; trading is shaped like
            its CLOB API. A bot written against Polymarket semantics can be pointed here with
            minimal changes.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="uppercase tracking-widest text-subtle">Base URL</span>
            <code className="rounded border border-line bg-foreground/[0.03] px-2.5 py-1 text-foreground">
              {BASE_URL}
            </code>
          </div>
        </header>

        <div className="lg:grid lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-14">
          {/* section rail */}
          <nav className="sticky top-24 hidden self-start lg:block" aria-label="Sections">
            <ul className="space-y-1 border-l border-line">
              {GROUPS.map((g) => (
                <li key={g.id}>
                  <a
                    href={`#${g.id}`}
                    className="-ml-px block border-l border-transparent py-1.5 pl-4 font-sans text-[13px] text-subtle transition-colors hover:border-brand hover:text-foreground"
                  >
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <main className="min-w-0">
            {/* Authentication */}
            <section className="border-b border-line py-12">
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
                Authentication
              </h2>
              <p className="mt-4 max-w-3xl font-sans text-sm leading-relaxed text-muted">
                <code className="font-mono text-foreground">POST /register</code> creates a user,
                provisions a server-held wallet and returns an{' '}
                <code className="font-mono text-foreground">api_key</code>. Two credentials are
                accepted, checked in this order:
              </p>
              <ul className="mt-4 max-w-3xl space-y-3 font-sans text-sm leading-relaxed text-muted">
                <li className="border-l-2 border-line pl-4">
                  <b className="font-mono text-foreground">X-API-Key</b> &mdash; a long-lived key.
                  This is what trading bots should use. If present it is checked first and a bad key
                  returns 401 immediately &mdash; it does <b>not</b> fall back to the bearer token.
                </li>
                <li className="border-l-2 border-line pl-4">
                  <b className="font-mono text-foreground">Authorization: Bearer &lt;jwt&gt;</b>{' '}
                  &mdash; the access_token from register/login, valid 24h by default. Used for
                  browser sessions.
                </li>
                <li className="border-l-2 border-amber-500/40 pl-4">
                  <b className="font-mono text-foreground">X-Admin-Token</b> &mdash; a separate,
                  unrelated mechanism for operator routes. Those routes accept neither an API key
                  nor a JWT.
                </li>
              </ul>
              <div className="mt-6 max-w-3xl">
                <CodeBlock
                  label="terminal"
                  code={`# register and capture the API key
curl -s -X POST ${BASE_URL}/register \\
  -H 'Content-Type: application/json' \\
  -d '{"email": "bot@example.com", "password": "correcthorsebattery", "handle": "mybot"}'
# → { "access_token": "…", "user": { "api_key": "…", "eth_address": "0x…" } }

# every trading call carries the key
curl -s ${BASE_URL}/me -H 'X-API-Key: YOUR_API_KEY'`}
                />
              </div>
            </section>

            {/* Conventions */}
            <section className="border-b border-line py-12">
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
                Conventions
              </h2>
              <dl className="mt-5 max-w-3xl space-y-4 font-sans text-sm leading-relaxed">
                {[
                  ['Prices', 'Probabilities in the open interval (0, 1), snapped to a $0.001 tick. A snapped value of ≤ 0 or ≥ 1 is rejected with 422. Accepted as a number or a numeric string.'],
                  ['Sizes', 'Whole shares, scaled to 10⁶ base units internally. Minimum 0.000001 shares; anything smaller is a 422.'],
                  ['Idempotency', 'client_order_id on POST /order is a per-user idempotency key. Retrying replays the original result instead of double-filling — safe on timeout.'],
                  ['Pagination', 'limit/offset on /markets, /events and /activity. Server enforces 1 ≤ limit ≤ 1000 and offset ≥ 0, raising 400 (not 422). /data/trades uses before/after cursors instead.'],
                  ['CSV filters', 'Params documented as comma-separated are split on "," server-side — send a,b,c, not a JSON array or repeated params.'],
                  ['Errors', 'FastAPI’s {"detail": …} everywhere. 422 validation · 401 auth · 404 not found · 409 already exists · 400 business rule.'],
                ].map(([term, body]) => (
                  <div key={term}>
                    <dt className="font-semibold text-foreground">{term}</dt>
                    <dd className="mt-1 text-muted">{body}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {GROUPS.map((g) => (
              <section key={g.id} id={g.id} className="scroll-mt-24 border-b border-line py-12 last:border-b-0">
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground">
                  {g.title}
                </h2>
                {g.blurb && (
                  <p className="mt-3 max-w-3xl font-sans text-sm leading-relaxed text-subtle">
                    {g.blurb}
                  </p>
                )}
                <div className="mt-5">
                  {g.endpoints.map((e) => (
                    <EndpointRow key={`${e.method} ${e.path}`} e={e} />
                  ))}
                </div>
              </section>
            ))}

            <p className="pt-10 font-sans text-xs leading-relaxed text-subtle">
              Generated from the project&rsquo;s{' '}
              <a
                href="https://github.com/skalenetwork/agentpit/blob/main/docs/API.md"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-brand underline-offset-4 hover:underline"
              >
                docs/API.md
              </a>
              , which is itself generated from the live OpenAPI schema. Where the two disagree, the
              schema wins.
            </p>
          </main>
        </div>
      </div>
    </div>
  )
}
