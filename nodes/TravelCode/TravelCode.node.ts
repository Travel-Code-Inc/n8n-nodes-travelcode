import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { approvalDescription } from './resources/approval';
import { expenseDescription } from './resources/expense';
import { expenseReportDescription } from './resources/expenseReport';
import { invoiceDescription } from './resources/invoice';
import { orderDescription } from './resources/order';
import { referenceDataDescription } from './resources/referenceData';
import { travelerDescription } from './resources/traveler';

export class TravelCode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Travel Code',
		name: 'travelCode',
		icon: { light: 'file:../../icons/travelcode.svg', dark: 'file:../../icons/travelcode.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Work with corporate trips, expenses and approvals in Travel Code',
		defaults: {
			name: 'Travel Code',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'travelCodeOAuth2Api', required: true }],
		requestDefaults: {
			baseURL: 'https://api.travel-code.com/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Approval', value: 'approval' },
					{ name: 'Expense', value: 'expense' },
					{ name: 'Expense Report', value: 'expenseReport' },
					{ name: 'Invoice', value: 'invoice' },
					{ name: 'Order', value: 'order' },
					{ name: 'Reference Data', value: 'data' },
					{ name: 'Traveler', value: 'traveler' },
					{ name: 'User', value: 'user' },
				],
				default: 'order',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['user'] } },
				options: [
					{
						name: 'Get Current',
						value: 'getCurrentUser',
						action: 'Get the token owner',
						description: 'Get the profile of the user the API token belongs to',
						routing: { request: { method: 'GET', url: '/user/me' } },
					},
				],
				default: 'getCurrentUser',
			},
			...approvalDescription,
			...expenseDescription,
			...expenseReportDescription,
			...invoiceDescription,
			...orderDescription,
			...referenceDataDescription,
			...travelerDescription,
		],
	};
}
