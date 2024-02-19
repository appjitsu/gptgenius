import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

import { generateTourImage, getSingleTour } from "@/utils/actions";
import TourInfo from "@/components/TourInfo";

const url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_API_KEY}&query=`;

const SingleTourPage = async ({ params }: any) => {
  const tour = await getSingleTour(params.id);

  if (!tour) {
    redirect("/tours");
  }

  const { title, city, country } = tour;
  const { data } = await axios.get(`${url}${city},${country}`);
  const tourImage = data.results[0]?.urls.raw;
  // const tourImage = await generateTourImage({ city, country });

  return (
    <div>
      <Link
        href="/tours"
        className="btn btn-secondary mb-12"
      >
        Back to tours
      </Link>
      {tourImage && (
        <div>
          <Image
            src={tourImage}
            width={300}
            height={300}
            className="rounded-xl shadow-xl mb-16 h-96 w-96 object-cover"
            alt={`${title} - ${city}, ${country}`}
          />
        </div>
      )}
      <TourInfo tour={tour} />
    </div>
  );
};

export default SingleTourPage;
