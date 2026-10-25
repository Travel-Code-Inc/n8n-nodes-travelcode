import type { INodeProperties } from 'n8n-workflow';
import { getManyProperties, rootPropertyOutput } from '../shared/getMany';

const resource = 'order';

export const orderDescription: INodeProperties[] = [
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
				action: 'Get an order',
				description: 'Get one order with its services and travellers',
				routing: {
					request: { method: 'GET', url: '=/orders/{{$parameter.orderId}}' },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many orders',
				description: "Get the company's orders, newest first",
				routing: {
					request: {
						method: 'GET',
						url: '/orders',
						qs: { scope: 'customer', sort: 'createdAt', sortOrder: 'desc' },
					},
					...rootPropertyOutput('items'),
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: [resource], operation: ['get'] } },
		description: 'Numeric order ID (orderId in list results)',
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
				displayName: 'Created From',
				name: 'dateFrom',
				type: 'dateTime',
				default: '',
				routing: {
					send: { type: 'query', property: 'dateFrom', value: '={{$value.slice(0, 10)}}' },
				},
			},
			{
				displayName: 'Created To',
				name: 'dateTo',
				type: 'dateTime',
				default: '',
				routing: {
					send: { type: 'query', property: 'dateTo', value: '={{$value.slice(0, 10)}}' },
				},
			},
			{
				displayName: 'Order Code',
				name: 'code',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'code' } },
			},
			{
				displayName: 'Passenger Name',
				name: 'passengerName',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'passengerName' } },
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
				placeholder: 'e.g. completed',
				routing: { send: { type: 'query', property: 'status' } },
			},
			{
				displayName: 'Trip Starts From',
				name: 'tourBeginFrom',
				type: 'dateTime',
				default: '',
				routing: {
					send: { type: 'query', property: 'tourBeginFrom', value: '={{$value.slice(0, 10)}}' },
				},
			},
			{
				displayName: 'Trip Starts To',
				name: 'tourBeginTo',
				type: 'dateTime',
				default: '',
				routing: {
					send: { type: 'query', property: 'tourBeginTo', value: '={{$value.slice(0, 10)}}' },
				},
			},
		],
	},
];
