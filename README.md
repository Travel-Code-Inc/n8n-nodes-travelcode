# n8n-nodes-travelcode

n8n community nodes for [Travel Code](https://travel-code.com) — corporate travel bookings, expenses, approvals and invoices.

## Installation

Follow the [n8n community nodes installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) and install `n8n-nodes-travelcode`.

## Nodes

### Travel Code

Also available to the n8n AI Agent as a tool.

| Resource | Operations |
|---|---|
| Approval | Get, Get Many, Approve, Reject |
| Expense | Get, Get Many |
| Expense Report | Get, Get Many |
| Invoice | Get Many |
| Order | Get, Get Many |
| Reference Data | List Airports, List Airlines |
| Traveler | Get Many (employees travelling now or soon) |
| User | Get Current User |

### Travel Code Trigger

Polls Travel Code and starts the workflow when something new appears:

- New Order
- New Expense
- New Approval Request (waiting for the connected user to decide)
- Expense Report Submitted

When the workflow is activated, the trigger remembers what already exists and only emits rows that appear afterwards.

## Credentials

Travel Code uses **OAuth 2.0 with PKCE**. The connected account's role decides what the nodes can see — a company admin sees the whole company, an employee only their own data.

1. In n8n, open **Credentials → New → Travel Code OAuth2 API** and copy the **OAuth Redirect URL** it shows.
2. Register an OAuth client with that URL:

   ```bash
   curl -X POST "https://travel-code.com/oauth/register" \
     -H "Content-Type: application/json" \
     -d '{"client_name": "My n8n", "redirect_uris": ["<OAuth Redirect URL from n8n>"]}'
   ```

3. Paste the returned `client_id` into **Client ID**, leave **Client Secret** empty, and click **Connect my account**.

Credentials created with version 0.1.x do not include the new scopes — reconnect them to use orders, expenses, approvals, invoices and travellers.

## Limits

Companies on the free Travel Code plan can make 10 API requests a day through connected apps. Premium and Pro plans are unlimited. A request over the limit returns HTTP 429.

## Development

```bash
npm install
npm run build
npm run lint
npm run dev
```

Releases are published to npm with provenance by `.github/workflows/publish.yml` when a GitHub release is published.

## Resources

- [Travel Code API documentation](https://apidocs.travel-code.com/)

## License

[MIT](LICENSE)
