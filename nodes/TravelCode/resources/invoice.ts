import type { INodeProperties } from 'n8n-workflow';
import { getManyProperties, rootPropertyOutput } from '../shared/getMany';

const resource = 'invoice';

export const invoiceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [resource] } },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many invoices',
				description: 'Get invoices with amounts due and payment status',
				routing: {
					request: { method: 'GET', url: '/invoices' },
					...rootPropertyOutput('items'),
				},
			},
		],
		default: 'getAll',
	},
	...getManyProperties(resource),
];
