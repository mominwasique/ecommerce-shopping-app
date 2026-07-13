import React from 'react'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { fetchStrapi, getStrapiImageUrl } from '@/app/lib/strapi'

export const dynamic = 'force-dynamic'

const products = async () => {
    let products = { data: [] }

    try {
        products = await fetchStrapi('/api/products?populate=image')
    } catch (error) {
        console.error('Failed to load products from Strapi', error)
    }

    return (
        <div>
            <section className="text-gray-600 body-font">
                <div className="container px-5 md:pt-20 pt-8 mx-auto">
                    <div className="flex flex-wrap w-full mb-10">
                        <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
                            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900 dark:text-white">My products</h1>
                            <div className="h-1 w-16 bg-indigo-500 rounded"></div>
                        </div>

                    </div>
                    <div className="flex flex-wrap m-4 " >
                        {products.data.map((item) => {
                            return (
                                <div key={item.id} className="xl:w-1/4 md:w-1/2 p-4  ">
                                    <div className="bg-gray-200 p-6 rounded-lg cursor-pointer h-[100%] sm:w-full">
                                        <img className="h-72 rounded m-auto mb-6" src={getStrapiImageUrl(item.image)} alt={item.title} />
                                        <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">{item.category}</h3>
                                        <h2 className="text-lg text-gray-900 font-medium title-font mb-4">{item.title}  </h2>
                                        <div className='flex flex-wrap gap-3 mb-3 '>
                                            <div className='hidden bg-red-800 bg-green-800 bg-gray-500 bg-yellow-500 bg-teal-500 bg-stone-500 bg-emerald-500 bg-slate-500 bg-blue-500 bg-[cream]-500'></div>
                                            <button className={`border-2 border-gray-300 ml-1  rounded-full w-6 h-6 focus:outline-none bg-${item.color}-500`} ></button>
                                            <h3 className='text-black '>{item.size}</h3>
                                        </div>
                                        <p className="leading-relaxed text-base mb-4">{item.description}</p>
                                        <Link href={`/products/${item.slug}`}>
                                            <Button className='rounded-full dark:text-black  dark:bg-teal-400'>
                                                Buy Now
                                            </Button></Link>
                                    </div>

                                </div>)
                        })}


                    </div>
                </div>
            </section>


        </div>


    )
}

export default products

