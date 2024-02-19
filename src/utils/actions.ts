"use server";

import OpenAI from "openai";

import prisma from "@/utils/db";
import { revalidatePath } from "next/cache";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateChatResponse = async (chatMessages: any) => {
  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        ...chatMessages,
      ],
      model: "gpt-3.5-turbo",
      temperature: 0,
    });
    return response.choices[0].message;
  } catch (error) {
    console.log(error);
    return null;
  }
};

type Destination = {
  city: string;
  country: string;
};

export const generateTourResponse = async ({ city, country }: Destination) => {
  try {
    const query = `Find an exact ${city} in this exact ${country}.
      If ${city} and ${country} exist, create a list of things families can do in this ${city}, ${country}.
      Once you have a list, create a one-day tour. Response should be  in the following JSON format:

      {
        "tour": {
          "city": "${city}",
          "country": "${country}",
          "title": "title of the tour",
          "description": "short description of the city and tour",
          "stops": ["short paragraph on the stop 1", "short paragraph on the stop 2","short paragraph on the stop 3"]
        }
      }

      "stops" property should include only three stops.
      If you can't find info on exact ${city}, return { "tour": null }, with no additional characters. Be careful with typos inside the JSON structure like extra commas after arrays last item, this info will be parsed with a JSON.parse() method.`;

    console.log("query", query);

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        { role: "user", content: query },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0,
      max_tokens: 1000,
    });
    console.log("response", response.choices[0].message);

    const tourData = JSON.parse(response.choices[0].message.content as string);
    console.log("tourData", tourData);

    if (!tourData.tour) {
      return null;
    }
    return { tour: tourData.tour, tokens: response.usage?.total_tokens };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getExistingTour = async ({ city, country }: Destination) => {
  console.log("getExistingTour", city, country);
  return prisma?.tour.findUnique({
    where: {
      city_country: {
        city,
        country,
      },
    },
  });
};

export const createNewTour = async (tour: any) => {
  return prisma?.tour.create({
    data: tour,
  });
};

export const getAllTours = async (searchTerm?: string) => {
  if (!searchTerm) {
    const tours = prisma?.tour.findMany({
      orderBy: {
        city: "asc",
      },
    });
    return tours;
  } else {
    const tours = prisma?.tour.findMany({
      where: {
        OR: [
          {
            city: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            country: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        city: "asc",
      },
    });
    return tours;
  }
};

export const getSingleTour = async (id: string) => {
  return prisma?.tour.findUnique({
    where: {
      id,
    },
  });
};

export const generateTourImage = async ({ city, country }: Destination) => {
  try {
    const tourImage = await openai.images.generate({
      prompt: `A panoramic view of the city ${city}, ${country}`,
      n: 1,
      size: "512x512",
    });
    return tourImage?.data[0]?.url;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const fetchUserTokensById = async (id: string) => {
  const result = await prisma?.token.findUnique({
    where: {
      clerkId: id,
    },
    select: {
      tokens: true,
    },
  });
  return result?.tokens;
};

export const generateUserTokensForId = async (id: string) => {
  const result = await prisma?.token.create({
    data: {
      clerkId: id,
    },
  });
  return result?.tokens;
};

export const fetchOrGenerateTokens = async (id: string) => {
  const tokens = await fetchUserTokensById(id);
  if (tokens) {
    return tokens;
  }
  return await generateUserTokensForId(id);
};

export const subtractTokens = async (id: string, tokens: number) => {
  const result = await prisma?.token.update({
    where: {
      clerkId: id,
    },
    data: {
      tokens: {
        decrement: tokens,
      },
    },
  });
  revalidatePath("/profile");
  return result?.tokens;
};
