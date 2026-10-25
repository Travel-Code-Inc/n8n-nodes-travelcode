import type { INodeProperties } from 'n8n-workflow';

export const referenceDataDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['data'] } },
		options: [
			{
				name: 'List Airlines',
				value: 'listAirlines',
				action: 'List airlines',
				description: 'Get the list of supported airlines (IATA, name)',
				routing: { request: { method: 'GET', url: '/data/airlines' } },
			},
			{
				name: 'List Airports',
				value: 'listAirports',
				action: 'List airports',
				description: 'Get the list of supported airports (IATA, city, country)',
				routing: { request: { method: 'GET', url: '/data/airports' } },
			},
		],
		default: 'listAirports',
	},
];
