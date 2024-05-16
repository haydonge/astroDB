import type { APIRoute } from "astro";// Astro 框架提供的类型，用于定义 API 路由处理程序的接口。
import { Link, db } from "astro:db";
import sanitize from "sanitize-html"; //用于清理和过滤 HTML 内容


//定义了一个名为 POST 的路由处理程序，这是一个异步函数，接收一个包含 request 的参数对象。
//使用 await request.json() 从请求中提取 JSON 数据，并将其存储在 data 变量中。
export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
//小心谨慎模型
  try {
    const { title, description, url, isRead } = data; //解析data数据

    if (!title || !description || !url || typeof isRead !== "boolean") {
      return new Response(
        JSON.stringify({
          message: "Please provide all required fields.",
          success: false,
        }),
        {
          status: 404,
        }
      );
    }

    const res = await db.insert(Link).values({
      title: sanitize(title),
      description: sanitize(description),
      url: sanitize(url),
      isRead,
    });

    if (res) {
      return new Response(
        JSON.stringify({
          message: "success",
          data: res,
          success: true,
        }),
        {
          status: 200,
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
        success: false,
      }),
      {
        status: 404,
      }
    );
  }
};
