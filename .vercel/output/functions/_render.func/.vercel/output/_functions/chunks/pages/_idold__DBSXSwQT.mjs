import { d as db, L as Link } from './_id__DLXKWOuF.mjs';
import { eq } from '@astrojs/db/dist/runtime/virtual.js';

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

export { DELETE, PATCH };
