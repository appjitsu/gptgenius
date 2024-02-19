const TourInfo = ({ tour }: any) => {
  const { title, description, stops } = tour;
  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl font-semibold mb-4">{title}</h1>
      <p className="leading-loose">{description}</p>
      <ul>
        {stops.map((stop: string, index: number) => (
          <li
            key={index}
            className="mb-4 bg-base-100 p-4 rounded-xl"
          >
            <p>{stop}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TourInfo;
