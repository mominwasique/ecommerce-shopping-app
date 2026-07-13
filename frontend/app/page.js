import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { fetchStrapi, getStrapiImageUrl } from '@/app/lib/strapi'

export const dynamic = 'force-dynamic'

export default async function CarouselDemo() {
  let product = { data: [] }
  let fetchError = null

  try {
    product = await fetchStrapi('/api/products?populate=image')
  } catch (error) {
    console.error('Failed to load products for homepage carousel', error)
    fetchError = error instanceof Error ? error.message : String(error)
  }

  return (
    <div className="md:min-h-screen md:bg-gray-200">
      {fetchError ? (
        <div className="mx-auto max-w-3xl rounded-xl border border-red-300 bg-red-50 p-6 text-red-900 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Unable to load products</h2>
          <p className="text-sm leading-6">
            The homepage product carousel could not connect to Strapi at <strong>{process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}</strong>.
          </p>
          <p className="mt-2 text-sm">Reason: {fetchError}</p>
          <p className="mt-4 text-sm text-gray-700">
            Make sure your Strapi backend is running on port <strong>1337</strong> and that the API is available at <strong>/api/products?populate=image</strong>.
          </p>
        </div>
      ) : product.data.length === 0 ? (
        <div className="mx-auto max-w-3xl rounded-xl border border-slate-300 bg-white p-6 text-slate-900 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">No products available</h2>
          <p className="text-sm leading-6">
            The homepage loaded successfully, but no products were returned from Strapi.
          </p>
        </div>
      ) : (
        <Carousel className="w-[75%]  md:w-[93%] mx-auto py-2 md:py-4 bg-gray-300">
          <CarouselContent>
            {product.data.map((item, index) => (
              <CarouselItem key={index}>
                <div className="w-full px-4 md:px-0 md:w-[650px] mx-auto  ">
                  <Card className=" w-full md:h-[530px] bg-gray-300">
                    <CardContent className="flex flex-col p-2 md:p-4">

                      <div className="relative aspect-square w-full  bg-gray-300">
                        <img
                          src={getStrapiImageUrl(item.image)}
                          alt={item.title}
                          className="  md:w-96 md:h-96 mx-auto rounded-lg transition-all duration-300 cursor-pointer mix-blend-multiply"
                        />
                        <div className="border-2 border-black hover:border-red-600 hover:text-red-600 transition-colors md:h-28">
                          <h1 className="text-sm md:text-xl font-semibold text-center mt-3 ">
                            {item.title}
                          </h1>
                          <p className="text-xs md:text-sm mx-1 md:text-center">{item.description}</p>
                        </div>
                        <span className="absolute top-2 md:left-2 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                          {index + 1}
                        </span>
                      </div>



                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="flex hover:bg-gray-500 transition-colors" />
          <CarouselNext className=" flex hover:bg-gray-500 transition-colors" />
        </Carousel>
      )}
    </div>
  )
}




















// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import React from "react";

// export default function Home() {
//   return (
//     <main className="bg-gray-50 text-gray-800 ">
//       {/* Hero Section */}
//       <section className="py-16 bg-gradient-to-r from-purple-500 to-indigo-600">
//        <img src="https://m.media-amazon.com/images/I/6136xt3Ps2L._SX679_.jpg "  width='800px' className="mx-auto h-96 "  />
//         {/* <div className="container mx-auto px-4 text-center">
//           <h1 className="text-4xl md:text-6xl font-bold mb-4">
//             Shop the Latest Trends
//           </h1>
//           <p className="text-lg md:text-xl mb-6">
//             Discover exclusive collections at unbeatable prices.
//           </p>
//           <button className="bg-white text-purple-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-200 transition">
//             Shop Now
//           </button>
//         </div> */}
//       </section>

//       {/* Product Categories */}
//       <section className="py-16">
//         <div className="container mx-auto px-4">
//           <h2 className="text-2xl md:text-4xl font-bold text-center mb-12">
//             Explore Categories
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {["Men", "Women", "Kids"].map((category) => (
//               <div
//                 key={category}
//                 className="relative group bg-gray-200 rounded-lg shadow-lg overflow-hidden"
//               >
//                 <img
//                   src={`/images/${category.toLowerCase()}.jpg`}
//                   alt={category}
//                   className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
//                 />
//                 <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                   <h3 className="text-white text-2xl font-bold">{category}</h3>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Featured Products */}
//       <section className="py-16 bg-gray-100">
//         <div className="container mx-auto px-4">
//           <h2 className="text-2xl md:text-4xl font-bold text-center mb-12">
//             Featured Products
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//             {[1, 2, 3, 4].map((product) => (
//               <div
//                 key={product}
//                 className="bg-white rounded-lg shadow-lg overflow-hidden"
//               >
//                 <img
//                   src={`/images/product${product}.jpg`}
//                   alt={`Product ${product}`}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-4">
//                   <h3 className="text-lg font-semibold">Product {product}</h3>
//                   <p className="text-sm text-gray-600">$99.99</p>
//                   <button className="mt-2 bg-indigo-600 text-white py-2 px-4 rounded-lg w-full hover:bg-indigo-700 transition">
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="py-16">
//         <div className="container mx-auto px-4">
//           <h2 className="text-2xl md:text-4xl font-bold text-center mb-12">
//             What Our Customers Say
//           </h2>
//           <div className="flex flex-col md:flex-row gap-6">
//             {[1, 2, 3].map((testimonial) => (
//               <div
//                 key={testimonial}
//                 className="bg-white rounded-lg shadow-lg p-6"
//               >
//                 <p className="text-gray-700 italic">
//                   "Amazing quality and fantastic service!"
//                 </p>
//                 <h4 className="mt-4 font-bold text-indigo-600">Customer {testimonial}</h4>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }


// "use client"
// import React from 'react'
// import { CarouselApi } from "@/components/ui/carousel"
// import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
// import { Button } from '@/components/ui/button'

// export default function GalleryCarousel() {
//   const [api, setApi] = React.useState()
//   const [current, setCurrent] = React.useState(0)
//   const [count, setCount] = React.useState(0)

//   // Gallery images array
//   const galleryImages = [
//     {
//       id: 1,
//       src: "/path-to-your-image-1.jpg",
//       title: "Canvas Print",
//       description: "Modern abstract art canvas print"
//     },
//     {
//       id: 2,
//       src: "https://m.media-amazon.com/images/I/6136xt3Ps2L._SX679_.jpg",
//       title: "Framed Photography",
//       description: "Nature photography in elegant frame"
//     },
//     {
//       id: 3,
//       src: "/path-to-your-image-3.jpg",
//       title: "Limited Edition",
//       description: "Exclusive artist signed print"
//     }
//   ]

//   React.useEffect(() => {
//     if (!api) {
//       return
//     }

//     // Set total number of slides
//     setCount(api.scrollSnapList().length)
//     // Set current slide (adding 1 for human-readable counting)
//     setCurrent(api.selectedScrollSnap() + 1)

//     // Update current slide when carousel changes
//     api.on("select", () => {
//       setCurrent(api.selectedScrollSnap() + 1)
//     })
//   }, [api])

//   return (
//     <div className="mx-auto w-[85%]">
//       <Carousel setApi={setApi}>
//         <CarouselContent>
//           {galleryImages.map((image) => (
//             <CarouselItem key={image.id}>
//               <div className="relative h-[400px] mx-auto w-[80%] ">
//                 <img
//                   src={image.src}
//                   alt={image.title}
//                   className="w-[500px] h-[450px] mx-auto"
//                 />
//                 {/* <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4"> */}
//                 {/* <h3 className="text-xl font-bold">{image.title}</h3> */}
//                 {/* <p>{image.description}</p> */}
//               </div>
//               {/* </div> */}
//             </CarouselItem>
//           ))}
//         </CarouselContent>
//         <div className="text-center mt-4">
//           Slide {current} of {count}
//         </div>
//         <CarouselNext className="w-20 h-20 border-black hover:bg-gray-300" />
//         <CarouselPrevious className="w-20 h-20 border-black hover:bg-gray-300" />


//       </Carousel>
//     </div>
//   )
// }




// import * as React from "react"

// import { Card, CardContent } from "@/components/ui/card"
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel"

// export default async function CarouselDemo() {

//   let res = await fetch(`http://localhost:1337/api/products?populate=*`)
//   let product = await res.json()

//   return (
//     <><Carousel className="w-[80%] mx-auto py-8 bg-gray-700">
//       <CarouselContent>
//         {product.data.map((item, index) => (
//           <CarouselItem key={index}>
//             <div className="w-[650px] h-[450px] mx-auto ">
//               <Card className="border-black w-full ">
//                 <CardContent className="flex-col aspect-square    ">
//                   <img src={item.image && item.image.name} className="w-96 h-96  mx-auto" />
//                   <h1 className="mx-auto text-center font-bold py-2 hover:text-red-600 ">{item.title}</h1>

//                 </CardContent>
//                 <span className="text-3xl font-semibold">{index + 1}</span>
//               </Card>
//             </div>
//           </CarouselItem>
//         ))}
//       </CarouselContent>
//       <CarouselPrevious className="hover:bg-gray-500" />
//       <CarouselNext className="hover:bg-gray-500" />
//     </Carousel>


//     </>
//   )
// }



