'use client'
import Image from 'next/image'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"

import { useEffect, useState } from "react";

export default function EventCard({
    features,
})
{
    const resultId = features.id; // Assuming resultId is fixed or coming from somewhere in your application
    

    return (
    <div>
    <Card className="gap-y-2">
    <CardHeader>
        <CardTitle>{features.title}</CardTitle>
    </CardHeader>
    <CardContent>
    <CardDescription className="border-solid border-2 border-gray-50 font-bold">
        {features.description}
    </CardDescription>
    <Carousel>
        <CarouselContent>
          <CarouselItem key={features.id}><img width={300} height={300} key={features.id} src={features.image_url} alt="Image" /></CarouselItem>
      </CarouselContent>
    </Carousel>
        <p>Time : {features.time}</p>
    </CardContent>
    <CardFooter className='card-footer-text text-blue-500 font-extrabold'>
        <a href={features.url}>Event Link</a>
    </CardFooter>
    </Card>
    </div>
)
} 