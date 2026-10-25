# Changelog

## 0.2.0

- New resources: Order, Expense, Expense Report, Approval (including Approve and Reject), Invoice, Traveler.
- New Travel Code Trigger node: New Order, New Expense, New Approval Request, Expense Report Submitted.
- The OAuth2 credential now requests `orders:read expenses:read approvals:read approvals:write invoices:read travelers:read`. Reconnect existing credentials to use the new resources.
- Reference Data and User operations are unchanged.

## 0.1.2

- Reference Data (List Airports, List Airlines) and User (Get Current User) over OAuth2 with PKCE.
