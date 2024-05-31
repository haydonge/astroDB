import { createRemoteDatabaseClient, asDrizzleTable } from '@astrojs/db/runtime';
import { eq } from '@astrojs/db/dist/runtime/virtual.js';

const db = await createRemoteDatabaseClient(process.env.ASTRO_STUDIO_APP_TOKEN, {"BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": true, "SITE": undefined, "ASSETS_PREFIX": undefined}.ASTRO_STUDIO_REMOTE_DB_URL ?? "https://db.services.astro.build");
const Link = asDrizzleTable("Link", { "columns": { "id": { "type": "number", "schema": { "unique": false, "deprecated": false, "name": "id", "collection": "Link", "primaryKey": true } }, "title": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "title", "collection": "Link", "primaryKey": false, "optional": false } }, "url": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "url", "collection": "Link", "primaryKey": false, "optional": false } }, "description": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "description", "collection": "Link", "primaryKey": false, "optional": false } }, "isRead": { "type": "boolean", "schema": { "optional": false, "unique": false, "deprecated": false, "name": "isRead", "collection": "Link", "default": false } } }, "deprecated": false, "indexes": {} }, false);
asDrizzleTable("Workorder", { "columns": { "id": { "type": "number", "schema": { "unique": false, "deprecated": false, "name": "id", "collection": "Workorder", "primaryKey": true } }, "title": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "title", "collection": "Workorder", "primaryKey": false, "optional": false } }, "url": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "url", "collection": "Workorder", "primaryKey": false, "optional": false } }, "description": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "description", "collection": "Workorder", "primaryKey": false, "optional": false } }, "finished": { "type": "boolean", "schema": { "optional": false, "unique": false, "deprecated": false, "name": "finished", "collection": "Workorder", "default": false } } }, "deprecated": false, "indexes": {} }, false);
const Stockonhand = asDrizzleTable("Stockonhand", { "columns": { "id": { "type": "number", "schema": { "unique": false, "deprecated": false, "name": "id", "collection": "Stockonhand", "primaryKey": true } }, "partnumber": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "partnumber", "collection": "Stockonhand", "primaryKey": false, "optional": false } }, "description": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "description", "collection": "Stockonhand", "primaryKey": false, "optional": false } }, "qty": { "type": "number", "schema": { "unique": false, "deprecated": false, "name": "qty", "collection": "Stockonhand", "primaryKey": false, "optional": false } }, "url": { "type": "text", "schema": { "unique": false, "deprecated": false, "name": "url", "collection": "Stockonhand", "primaryKey": false, "optional": false } }, "safeqty": { "type": "number", "schema": { "unique": false, "deprecated": false, "name": "safeqty", "collection": "Stockonhand", "primaryKey": false, "optional": false } } }, "deprecated": false, "indexes": {} }, false);

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
    const res = await db.delete(Stockonhand).where(eq(Stockonhand.id, id));
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
  const { id } = params;
  const { partnumber, description, qty, url, safeqty } = await request.json();
  if (!id || !partnumber || !description || qty === void 0 || !url || safeqty === void 0) {
    return new Response(
      JSON.stringify({
        message: "Please provide all required fields.",
        success: false
      }),
      {
        status: 400
      }
    );
  }
  try {
    const res = await db.update(Stockonhand).set({
      partnumber,
      description,
      qty: Number(qty),
      url,
      safeqty: Number(safeqty)
    }).where(eq(Stockonhand.id, Number(id)));
    if (res) {
      return new Response(
        JSON.stringify({
          message: "Update successful",
          success: true
        }),
        {
          status: 200
        }
      );
    } else {
      throw new Error("Update failed");
    }
  } catch (e) {
    console.error("Patch ERROR");
    return new Response(
      JSON.stringify({
        message: e.message || "Internal Server Error",
        success: false
      }),
      {
        status: 500
      }
    );
  }
};

const _id__json = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	DELETE,
	PATCH
}, Symbol.toStringTag, { value: 'Module' }));

export { Link as L, Stockonhand as S, _id__json as _, db as d };
