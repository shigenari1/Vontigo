import { knexInstance } from '$lib/core/core/server/data/db/connection';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, params }) {
	let content: any;
	let authors: any;
	// console.log(params);
	try {
		const post: any[] = await knexInstance
			.select(
				'p.*',
				't.id as primary_tag',
				't.name as primary_tag_name',
				't.slug as primary_tag_slug'
			)
			.from('posts as p')
			.leftJoin('posts_tags as pt', 'p.id', 'pt.post_id')
			.leftJoin('tags as t', 't.id', 'pt.tag_id')
			.where({
				'p.status': 'published',
				'p.slug': params.slug
			})
			.first();

		content = post;

		const qAuthors: any[] = await knexInstance
			.select('u.*')
			.from('posts as p')
			.leftJoin('posts_authors as pa', 'p.id', 'pa.post_id')
			.leftJoin('users as u', 'u.id', 'pa.author_id')
			.where({
				'p.slug': params.slug
			})
			.orderBy('sort_order');

		authors = qAuthors;
		//console.log(authors);
	} catch (error) {
		return new Response(JSON.stringify(error), { status: 300 });
	}
	return new Response(
		JSON.stringify({
			content: content,
			authors: authors
		}),
		{ status: 200 }
	);
}

async function getAllRows(tableName: string): Promise<any[] | null> {
	try {
		const rows: any[] = await knexInstance(tableName).select();
		return rows;
	} catch (error) {
		console.error(error);
		return null;
	}
}

// export function GET({ url, params }) {
// 	let returnRows: any;
// 	console.log(params);

// 	const sql = `
//     select * from posts p where p.slug = $slug and p.status = $status;
//     `;
// 	const stmnt = db.prepare(sql);
// 	const rows = stmnt.get(params);
// 	// console.log(rows);
// 	return new Response(JSON.stringify(rows), { status: 200 });
// }
