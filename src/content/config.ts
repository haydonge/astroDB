import {z,defineCollection} from "astro:content"
const product =defineCollection({
    type: "data",
    schema:z.object({
        name:z.string().max(50,{message: "you must keep name to 50 characters or less"}),
        price:z.number(),
        color:z.string(),
        brand:z.string(),
        category:z.string(),
        catagory :z.enum ([
            "Automotive","Home & Garden","Fashion","Electronics","Toys"
        ]),

    }),
});

export const collectons ={
    product,
}
 