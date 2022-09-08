import { create_client } from './client.js';
import { init } from './singletons.js';
import { set_paths } from '../paths.js';
import { set_public_env } from '../env-public.js';

/**
 * @param {{
 *   env: Record<string, string>;
 *   hydrate: Parameters<import('./types').Client['_hydrate']>[0];
 *   paths: {
 *     assets: string;
 *     base: string;
 *   },
 *   target: Element;
 *   trailing_slash: import('types').TrailingSlash;
 * }} opts
 */
export async function start({ env, hydrate, paths, target, trailing_slash }) {
	set_public_env(env);
	set_paths(paths);

	console.log('Starting client');
	performance.mark('Start JS');

	const client = create_client({
		target,
		base: paths.base,
		trailing_slash
	});

	performance.mark('Svelte Init');
	init({ client });

	if (hydrate) {
		performance.mark('Start Hydrate');
		await client._hydrate(hydrate);
	} else {
		client.goto(location.href, { replaceState: true });
	}
	performance.mark('Start Router');
	client._start_router();
}
