import type { Icon, ICredentialType, INodeProperties } from 'n8n-workflow';

export class TravelCodeOAuth2Api implements ICredentialType {
	name = 'travelCodeOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Travel Code OAuth2 API';

	icon: Icon = { light: 'file:../icons/travelcode.svg', dark: 'file:../icons/travelcode.svg' };

	documentationUrl = 'https://apidocs.travel-code.com';

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'pkce',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://travel-code.com/oauth/authorize',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://travel-code.com/oauth/token',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default:
				'airports:read airlines:read flights:search flights:status flights:stats orders:read expenses:read approvals:read approvals:write invoices:read travelers:read',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'header',
		},
	];
}
