"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getAllTours } from "@/utils/actions";
import ToursList from "./ToursList";

const ToursPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const { data, isPending } = useQuery({
    queryKey: ["tours", searchValue],
    queryFn: () => getAllTours(searchValue),
  });
  return (
    <>
      <form className="max-w-lg mb-12">
        <div className="join w-full">
          <input
            type="text"
            placeholder="enter city or country..."
            className="input input-bordered join-item w-full"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-primary join-item uppercase"
            disabled={isPending}
            onClick={() => setSearchValue("")}
          >
            {isPending ? "please wait..." : "reset"}
          </button>
        </div>
      </form>
      {isPending ? <span className="loading loading-lg"></span> : null}
      {data && <ToursList data={data} />}
    </>
  );
};

export default ToursPage;
