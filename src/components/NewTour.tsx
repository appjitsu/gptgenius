"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  getExistingTour,
  generateTourResponse,
  createNewTour,
  fetchUserTokensById,
  subtractTokens,
} from "@/utils/actions";
import { toProperCase } from "@/utils/helpers";
import TourInfo from "@/components/TourInfo";
import { useAuth } from "@clerk/nextjs";

const NewTour = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const {
    mutate,
    isPending,
    data: tour,
  } = useMutation({
    mutationFn: async (destination: any) => {
      const existingTour = await getExistingTour(destination);
      console.log("existing tour", existingTour);
      if (existingTour) {
        return existingTour;
      }

      const currentTokens = await fetchUserTokensById(userId || "");
      if (currentTokens! < 300) {
        toast.error("You don't have enough tokens to generate a new tour");
        return null;
      }

      const newTour = await generateTourResponse(destination);
      if (!newTour) {
        toast.error("No matching city found");
        return null;
      }

      await createNewTour(newTour.tour);
      const newTokens = await subtractTokens(userId || "", newTour.tokens!);
      toast.success(
        `Tour generated successfully! (${newTokens} tokens remaining...)`
      );
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      return newTour.tour;
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const destination = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [
        key,
        typeof value === "string" ? toProperCase(value) : value,
      ])
    );
    mutate(destination);
  };

  if (isPending) {
    return <span className="loading loading-lg"></span>;
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mb-6"
      >
        <h2 className="mb-4">Select your dream destination</h2>
        <div className="join w-full">
          <input
            type="text"
            name="city"
            placeholder="city"
            className="input input-bordered join-item w-full"
            required
          />
          <input
            type="text"
            name="country"
            placeholder="country"
            className="input input-bordered join-item w-full"
            required
          />
          <button
            type="submit"
            className="btn btn-primary join-item uppercase"
          >
            generate tour
          </button>
        </div>
      </form>
      {tour ? <TourInfo tour={tour} /> : null}
    </>
  );
};

export default NewTour;
