// services/nehnutelnostiService.ts
import axiosInstance from "./axios";

export type Location = {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  houseNumber?: string;
  apartment?: string;
};

export type Nehnutelnost = {
  _id: string;
  title: string;
  desc: string;
  price: number;
  area: number;
  state: string;
  type: string;
  location: Location;
  author: string | { _id: string; email: string; name: string };
  createdAt: string;
  updatedAt: string;
  images?: string[];
  // Voliteľné polia pre byt/dom
  rooms?: number;
  bathrooms?: number;
  hasGarage?: boolean;
  hasBalcony?: boolean;
  hasTerrace?: boolean;
  hasElevator?: boolean;
  floor?: number;
  totalFloors?: number;
  constructionYear?: number;
  renovationYear?: number;
  energyClass?: string;
  heatingType?: string;
  condition?: string;
  // Voliteľné polia pre pozemok
  landType?: string;
  isFenced?: boolean;
  hasUtilities?: boolean;
  utilitiesTypes?: string[];
  terrainType?: string;
};

export const nehnutelnostiService = {
  getAll: async (): Promise<Nehnutelnost[]> => {
    const response = await axiosInstance.get("/nehnutelnosti");
    return response.data;
  },

  getById: async (id: string): Promise<Nehnutelnost> => {
    const response = await axiosInstance.get(`/nehnutelnosti/${id}`);
    return response.data;
  },

  create: async (formData: FormData): Promise<Nehnutelnost> => {
    const response = await axiosInstance.post("/nehnutelnosti", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  update: async (id: string, formData: FormData): Promise<Nehnutelnost> => {
    const response = await axiosInstance.patch(
      `/nehnutelnosti/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/nehnutelnosti/${id}`);
  },

  // createJson: async (data: any): Promise<Nehnutelnost> => {
  //   const response = await axiosInstance.post("/nehnutelnosti", data);
  //   return response.data;
  // },

  // updateJson: async (id: string, data: any): Promise<Nehnutelnost> => {
  //   const response = await axiosInstance.patch(`/nehnutelnosti/${id}`, data);
  //   return response.data;
  // },

  // // Pre obrázky - FormData
  // createWithImages: async (formData: FormData): Promise<Nehnutelnost> => {
  //   const response = await axiosInstance.post("/nehnutelnosti", formData, {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });
  //   return response.data;
  // },
};
