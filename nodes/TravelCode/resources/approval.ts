import type { INodeProperties } from 'n8n-workflow';
import { getManyProperties, rootPropertyOutput } from '../shared/getMany';

const resource = 'approval';

export const approvalTypeOptions = [
	{ name: 'Budget Top-Up', value: 'budget_top_up' },
	{ name: 'Card Limit Request', value: 'card_limit_request' },
	{ name: 'Card Request', value: 'card_request' },
	{ name: 'Duty of Care Message', value: 'duty_of_care_send' },
	{ name: 'Expense', value: 'expense' },
	{ name: 'Expense Report', value: 'expense_report' },
	{ name: 'Order Change', value: 'order_field_change' },
	{ name: 'Order Service Change', value: 'order_service_field_change' },
];

export const approvalDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [resource] } },
		options: [
			{
				name: 'Approve',
				value: 'approve',
				action: 'Approve a request',
				description: 'Approve a pending request the token owner may decide',
				routing: {
					request: { method: 'POST', url: '=/approvals/{{$parameter.approvalId}}/approve' },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an approval request',
				routing: {
					request: { method: 'GET', url: '=/approvals/{{$parameter.approvalId}}' },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many approval requests',
				description: 'Get approval requests visible to the token owner, newest first',
				routing: {
					request: {
						method: 'GET',
						url: '/approvals',
						qs: { sort: 'createdAt', sortOrder: 'desc' },
					},
					...rootPropertyOutput('items'),
				},
			},
			{
				name: 'Reject',
				value: 'reject',
				action: 'Reject a request',
				description: 'Reject a pending request with a reason',
				routing: {
					request: { method: 'POST', url: '=/approvals/{{$parameter.approvalId}}/reject' },
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Approval ID',
		name: 'approvalId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: [resource], operation: ['get', 'approve', 'reject'] } },
	},
	{
		displayName: 'Reason',
		name: 'comment',
		type: 'string',
		required: true,
		default: '',
		typeOptions: { rows: 2 },
		displayOptions: { show: { resource: [resource], operation: ['reject'] } },
		description: 'Shown to the requester',
		routing: { send: { type: 'body', property: 'comment' } },
	},
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		default: '',
		typeOptions: { rows: 2 },
		displayOptions: { show: { resource: [resource], operation: ['approve'] } },
		routing: { send: { type: 'body', property: 'comment' } },
	},
	{
		displayName: 'List',
		name: 'scope',
		type: 'options',
		default: 'active',
		displayOptions: { show: { resource: [resource], operation: ['getAll'] } },
		options: [
			{ name: 'Active', value: 'active', description: 'Waiting for a decision' },
			{ name: 'Past', value: 'past', description: 'Already decided or canceled' },
		],
		routing: { send: { type: 'query', property: 'scope' } },
	},
	...getManyProperties(resource),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: [resource], operation: ['getAll'] } },
		options: [
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				default: 'approver',
				options: [
					{ name: 'Any', value: 'any' },
					{ name: 'Approver', value: 'approver', description: 'Requests the token owner decides' },
					{ name: 'Requester', value: 'requester', description: 'Requests the token owner made' },
				],
				routing: { send: { type: 'query', property: 'role' } },
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				default: 'expense',
				options: approvalTypeOptions,
				routing: { send: { type: 'query', property: 'filter[type]' } },
			},
		],
	},
];
