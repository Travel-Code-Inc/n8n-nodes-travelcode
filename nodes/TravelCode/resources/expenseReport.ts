import type { INodeProperties } from 'n8n-workflow';
import { getManyProperties, rootPropertyOutput } from '../shared/getMany';

const resource = 'expenseReport';

export const expenseReportDescription: INodeProperties[] = [
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
				action: 'Get an expense report',
				routing: {
					request: { method: 'GET', url: '=/expense-reports/{{$parameter.expenseReportId}}' },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many expense reports',
				routing: {
					request: { method: 'GET', url: '/expense-reports' },
					...rootPropertyOutput('items'),
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Expense Report ID',
		name: 'expenseReportId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: [resource], operation: ['get'] } },
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
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'submitted',
				options: [
					{ name: 'Approved', value: 'approved' },
					{ name: 'Closed', value: 'closed' },
					{ name: 'Draft', value: 'draft' },
					{ name: 'Exported', value: 'exported' },
					{ name: 'Rejected', value: 'rejected' },
					{ name: 'Submitted', value: 'submitted' },
				],
				routing: { send: { type: 'query', property: 'status' } },
			},
			{
				displayName: 'Employee User ID',
				name: 'userId',
				type: 'number',
				default: 0,
				routing: { send: { type: 'query', property: 'userId' } },
			},
		],
	},
];
