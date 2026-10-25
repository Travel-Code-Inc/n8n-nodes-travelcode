import {
	NodeApiError,
	NodeConnectionTypes,
	type IDataObject,
	type IHttpRequestOptions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type IPollFunctions,
	type JsonObject,
} from 'n8n-workflow';

interface EventSource {
	url: string;
	qs: IDataObject;
	rootProperty: string;
	key: (row: IDataObject) => string;
}

// Keys stay comparable across polls, so a row that re-enters the window is not emitted twice.
const EVENTS: Record<string, EventSource> = {
	newOrder: {
		url: '/orders',
		qs: { scope: 'customer', sort: 'createdAt', sortOrder: 'desc' },
		rootProperty: 'items',
		key: (row) => String(row.orderId),
	},
	newExpense: {
		url: '/expenses',
		qs: { scope: 'company', sort: 'createdAt', sortOrder: 'desc' },
		rootProperty: 'items',
		key: (row) => String(row.id),
	},
	newApprovalRequest: {
		url: '/approvals',
		qs: { scope: 'active', role: 'approver', sort: 'createdAt', sortOrder: 'desc' },
		rootProperty: 'items',
		key: (row) => String(row.id),
	},
	expenseReportSubmitted: {
		url: '/expense-reports',
		qs: { status: 'submitted' },
		rootProperty: 'items',
		key: (row) => `${String(row.id)}@${String(row.submittedAt)}`,
	},
};

const API_BASE_URL = 'https://api.travel-code.com/v1';
const POLL_WINDOW = 50;
const MAX_REMEMBERED = 1000;

export class TravelCodeTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Travel Code Trigger',
		name: 'travelCodeTrigger',
		icon: { light: 'file:../../icons/travelcode.svg', dark: 'file:../../icons/travelcode.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts the workflow when something new happens in Travel Code',
		defaults: {
			name: 'Travel Code Trigger',
		},
		polling: true,
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'travelCodeOAuth2Api', required: true }],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				required: true,
				default: 'newOrder',
				options: [
					{
						name: 'Expense Report Submitted',
						value: 'expenseReportSubmitted',
						description: 'An employee submitted an expense report for approval',
					},
					{
						name: 'New Approval Request',
						value: 'newApprovalRequest',
						description: 'A request is waiting for the token owner to decide',
					},
					{
						name: 'New Expense',
						value: 'newExpense',
						description: 'An expense or card transaction was added',
					},
					{
						name: 'New Order',
						value: 'newOrder',
						description: 'A booking was created in the company',
					},
				],
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const event = this.getNodeParameter('event') as string;
		const source = EVENTS[event];
		const options: IHttpRequestOptions = {
			method: 'GET',
			baseURL: API_BASE_URL,
			url: source.url,
			qs: { ...source.qs, limit: POLL_WINDOW },
			json: true,
		};

		let rows: IDataObject[];
		try {
			const response = (await this.helpers.httpRequestWithAuthentication.call(
				this,
				'travelCodeOAuth2Api',
				options,
			)) as IDataObject;
			rows = (response[source.rootProperty] as IDataObject[] | undefined) ?? [];
		} catch (error) {
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}

		if (this.getMode() === 'manual') {
			return rows.length ? [this.helpers.returnJsonArray(rows.slice(0, 1))] : null;
		}

		const staticData = this.getWorkflowStaticData('node');
		const seen = new Set((staticData.seen as string[] | undefined) ?? []);
		const firstRun = staticData.seen === undefined;

		const fresh = rows.filter((row) => !seen.has(source.key(row)));
		const remembered = [...fresh.map(source.key), ...seen].slice(0, MAX_REMEMBERED);
		staticData.seen = remembered;

		if (firstRun || fresh.length === 0) {
			return null;
		}

		return [this.helpers.returnJsonArray(fresh.reverse())];
	}
}
