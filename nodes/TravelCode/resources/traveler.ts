import type { INodeProperties } from 'n8n-workflow';
import { getManyProperties, rootPropertyOutput } from '../shared/getMany';

const resource = 'traveler';

export const travelerDescription: INodeProperties[] = [
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
				action: 'Get travellers on a trip',
				description: 'Get employees who are travelling now or soon, with their location',
				routing: {
					request: { method: 'GET', url: '/travelers' },
					...rootPropertyOutput('data'),
				},
			},
		],
		default: 'getAll',
	},
	...getManyProperties(resource),
];
