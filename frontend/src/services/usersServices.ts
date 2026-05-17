// services/usersServices.ts
import axiosInstance from "./axios";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  favorites: string[];
};

export const usersService = {
  // Admin metódy
  getAll: async (): Promise<User[]> => {
    const response = await axiosInstance.get("/users");
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  update: async (
    id: string,
    data: { name?: string; role?: string },
  ): Promise<User> => {
    const response = await axiosInstance.patch(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },

  // Metódy pre vlastného používateľa (prihláseného)
  getMe: async (): Promise<User> => {
    const response = await axiosInstance.get("/users/me");
    return response.data;
  },

  updateMe: async (data: { name?: string; email?: string }): Promise<User> => {
    const response = await axiosInstance.patch("/users/me", data);
    return response.data;
  },

  updateMyPassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    const response = await axiosInstance.patch("/users/me/password", data);
    return response.data;
  },

  deleteMe: async (): Promise<{ message: string }> => {
    const response = await axiosInstance.delete("/users/me");
    return response.data;
  },

  toggleFav: async (realityId: string): Promise<{ favorites: string[] }> => {
    // Použite endpoint /users/me/favs/:realityId
    const response = await axiosInstance.post(`/users/me/favs/${realityId}`);
    return response.data;
  },

  removeFav: async (realityId: string): Promise<{ favorites: string[] }> => {
    const response = await axiosInstance.delete(`/users/me/favs/${realityId}`);
    return response.data;
  },
};
