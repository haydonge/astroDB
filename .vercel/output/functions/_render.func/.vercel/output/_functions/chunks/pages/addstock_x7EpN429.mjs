import { d as db, S as Stockonhand } from './_id__DtOgwdQZ.mjs';

const POST = async ({ request }) => {
  const data = await request.json();
  try {
    const { partnumber, description, qty, url, safeqty } = data;
    if (!partnumber || !description || !url) {
      return new Response(
        JSON.stringify({
          message: "Please provide all required fields 11.",
          success: false
        }),
        {
          status: 404
        }
      );
    }
    const res = await db.insert(Stockonhand).values({
      partnumber,
      description,
      qty,
      url,
      safeqty
    });
    if (res) {
      return new Response(
        JSON.stringify({
          message: "success",
          data: res,
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

export { POST };
