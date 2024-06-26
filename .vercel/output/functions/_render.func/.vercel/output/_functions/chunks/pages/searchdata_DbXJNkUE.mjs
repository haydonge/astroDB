import { d as db, S as Stockonhand } from './_id__DLXKWOuF.mjs';
import { or, like } from '@astrojs/db/dist/runtime/virtual.js';

const SEARCH = async ({ request }) => {
  const resc = await request.json();
  try {
    const partnumber = resc;
    if (!partnumber) {
      return new Response(
        JSON.stringify({
          message: "Please provide all required fields search.",
          success: false
        }),
        {
          status: 404
        }
      );
    }
    let query;
    query = await db.select().from(Stockonhand).where(
      or(
        like(Stockonhand.partnumber, `%${partnumber}%`),
        like(Stockonhand.description, `%${partnumber}%`)
      )
    );
    if (query) {
      return new Response(
        JSON.stringify({
          message: "success",
          data: query,
          success: true
        }),
        {
          status: 200
        }
      );
    } else {
      throw new Error("There was a problem with the db response.");
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

export { SEARCH };
