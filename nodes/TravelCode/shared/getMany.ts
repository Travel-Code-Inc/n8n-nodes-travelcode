import type { INodeProperties } from 'n8n-workflow';

const PAGE_SIZE = 100;

/**
 * Return All / Limit pair for Travel Code list endpoints, which page with
 * `limit` + `offset`. Rows are unwrapped by the operation's rootPropertyOutput.
 */
export function getManyProperties(resource: string, maxLimit = PAGE_SIZE): INodeProperties[] {
	const show = { resource: [resource], operation: ['getAll'] };

	return [
		{
			displayName: 'Return All',
			name: 'returnAll',
			type: 'boolean',
			displayOptions: { show },
			default: false,
			description: 'Whether to return all results or only up to a given limit',
			routing: {
				send: { paginate: '={{ $value }}' },
				operations: {
					pagination: {
						type: 'offset',
						properties: {
							limitParameter: 'limit',
							offsetParameter: 'offset',
							pageSize: maxLimit,
							type: 'query',
						},
					},
				},
			},
		},
		{
			displayName: 'Limit',
			name: 'limit',
			type: 'number',
			displayOptions: { show: { ...show, returnAll: [false] } },
			typeOptions: { minValue: 1, maxValue: maxLimit },
			default: 50,
			description: 'Max number of results to return',
			routing: {
				send: { type: 'query', property: 'limit' },
				output: { maxResults: '={{$value}}' },
			},
		},
	];
}

export function rootPropertyOutput(property: string) {
	return {
		output: {
			postReceive: [{ type: 'rootProperty' as const, properties: { property } }],
		},
	};
}
