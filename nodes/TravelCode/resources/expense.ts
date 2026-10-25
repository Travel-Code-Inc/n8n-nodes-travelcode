import type { INodeProperties } from 'n8n-workflow';
import { getManyProperties, rootPropertyOutput } from '../shared/getMany';

const resource = 'expense';

export const expenseDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [resource] } },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get an expense',
				routing: {
					request: { method: 'GET', url: '=/expenses/{{$parameter.expenseId}}' },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many expenses',
				description: 'Get expenses and card spend, newest first',
				routing: {
					request: {
						method: 'GET',
						url: '/expenses',
						qs: { sort: 'createdAt', sortOrder: 'desc' },
					},
					...rootPropertyOutput('items'),
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Expense ID',
		name: 'expenseId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['get'] } },
	},
	{
		displayName: 'Scope',
		name: 'scope',
		type: 'options',
		default: 'company',
		displayOptions: { show: { resource: [resource], operation: ['getAll'] } },
		options: [
			{
				name: 'Company',
				value: 'company',
				description: 'Expenses of all employees (needs a company admin role)',
			},
			{ name: 'Own', value: 'own', description: 'Only expenses of the token owner' },
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
				displayName: 'Date From',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				description: 'Spent on or after this date',
				routing: {
					send: { type: 'query', property: 'filter[dateFrom]', value: '={{$value.slice(0, 10)}}' },
				},
			},
			{
				displayName: 'Date To',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				description: 'Spent on or before this date',
				routing: {
					send: { type: 'query', property: 'filter[dateTo]', value: '={{$value.slice(0, 10)}}' },
				},
			},
			{
				displayName: 'Source',
				name: 'source',
				type: 'options',
				default: 'manual',
				options: [
					{ name: 'Card', value: 'card' },
					{ name: 'Manual', value: 'manual' },
				],
				routing: { send: { type: 'query', property: 'filter[source]' } },
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'pending',
				options: [
					{ name: 'Approved', value: 'approved' },
					{ name: 'Canceled', value: 'canceled' },
					{ name: 'Pending', value: 'pending' },
					{ name: 'Pending Settlement', value: 'pending_settlement' },
					{ name: 'Rejected', value: 'rejected' },
				],
				routing: { send: { type: 'query', property: 'filter[status]' } },
			},
		],
	},
];
