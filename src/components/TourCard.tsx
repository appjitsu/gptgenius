import Link from "next/link";

const ToursCard = ({ tour }: any) => {
  const { city, country, id } = tour;
  return (
    <Link
      href={`/tours/${id}`}
      className="car card-compact rounded-xl bg-base-100"
    >
      <div className="card-body items-center text-center">
        <h2 className="card-title text-center">
          {city}, {country}
        </h2>
      </div>
    </Link>
  );
};

export default ToursCard;
