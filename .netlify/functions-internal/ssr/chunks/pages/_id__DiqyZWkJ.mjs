import { createRemoteDatabaseClient, asDrizzleTable } from '@astrojs/db/runtime';
import { eq } from '@astrojs/db/dist/runtime/config.js';

const db = await createRemoteDatabaseClient("c39479343a272cab6cf3fd4e36441e54ce655e54:gbaiecxr8khwoyk5pdtlnonxdruu", {"BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": true, "SITE": undefined, "ASSETS_PREFIX": undefined}.ASTRO_STUDIO_REMOTE_DB_URL ?? "https://db.services.astro.build");
const Link = asDrizzleTable("Link", { "columns": { "id": { "type": "number", "schema": { "unique": false, "deprecated": false, "name": "id", "collection": "Link", "primaryKey": true } }, "title": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "title", "collection": "Link", "primaryKey": false, "optional": false } }, "url": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "url", "collection": "Link", "primaryKey": false, "optional": false } }, "description": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "description", "collection": "Link", "primaryKey": false, "optional": false } }, "isRead": { "type": "boolean", "schema": { "optional": false, "unique": false, "deprecated": false, "name": "isRead", "collection": "Link", "default": false } } }, "deprecated": false }, false);

const DELETE = async ({ params }) => {
  const id = Number(params.id);
  if (!id) {
    return new Response(
      JSON.stringify({
        message: "Please provide all required fields.",
        success: false
      }),
      {
        status: 404
      }
    );
  }
  try {
    const res = await db.delete(Link).where(eq(Link.id, id));
    if (res) {
      return new Response(null, { status: 204 });
    } else {
      throw new Error("prob, bob");
    }
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({
        message: e,
        success: false
      }),
      {
        status: 404
      }
    );
  }
};
const PATCH = async ({ params, request }) => {
  const { isRead } = await request.json();
  const id = Number(params.id);
  if (!id) {
    return new Response(
      JSON.stringify({
        message: "Please provide all required fields.",
        success: false
      }),
      {
        status: 404
      }
    );
  }
  try {
    const res = await db.update(Link).set({ isRead }).where(eq(Link.id, id));
    if (res) {
      return new Response(
        JSON.stringify({
          message: "success",
          success: true
        })
      );
    } else {
      throw new Error("prob, bob");
    }
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({
        message: e,
        success: false
      }),
      {
        status: 404
      }
    );
  }
};

const _id__json = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	DELETE,
	PATCH
}, Symbol.toStringTag, { value: 'Module' }));

export { Link as L, _id__json as _, db as d };
