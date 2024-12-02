

import { Api } from '$lib/api';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {

	let wtf = await Api.get("/translate", fetch);
	console.log(wtf);


	// error(404, 'Not found');
}