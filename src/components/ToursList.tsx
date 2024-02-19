import TourCard from "./TourCard";

const ToursList = ({ data }: any) => {
  if (data.length === 0) {
    return <h4 className="text-lg">No Tours Available</h4>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {data.map((tour: any) => {
        return (
          <TourCard
            key={tour.id}
            tour={tour}
          />
        );
      })}
    </div>
  );
};

export default ToursList;
