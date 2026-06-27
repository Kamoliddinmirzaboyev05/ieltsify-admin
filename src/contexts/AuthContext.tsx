import React, { useState } from "react";
import { apiClient } from "@/lib/api";
import { AuthContext } from "@/contexts/AuthContextBase";
import type { User } from "@/contexts/AuthContextBase";

/** Loose shape of /accounts/profile/ — fields nest inconsistently. */
interface ProfileInfo {
  id?: number | string;
  first_name?: string;
  last_name?: string;
  email?: string;
  username?: string;
  user_info?: ProfileInfo;
  data?: ProfileInfo;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await apiClient.login(email, password);

      // Role tekshirish - faqat admin kirishi mumkin
      if (data.role !== "admin") {
        apiClient.logout();
        throw new Error("Siz admin emassiz. Kirish taqiqlangan.");
      }

      // Profilni olish
      const profileResponse =
        await apiClient.get<ProfileInfo>("/accounts/profile/");
      const profileData = profileResponse?.data || profileResponse;

      const userInfo = profileData?.user_info || profileData;

      const newUser: User = {
        id: userInfo?.id?.toString() || "1",
        name:
          [userInfo?.first_name, userInfo?.last_name]
            .filter(Boolean)
            .join(" ") || email.split("@")[0],
        email: userInfo?.email || email,
        username: userInfo?.username || email.split("@")[0],
        role: data.role || "admin",
      };

      setUser(newUser);
      sessionStorage.setItem("user", JSON.stringify(newUser));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
  };

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user && apiClient.isAuthenticated(),
        isAdmin,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
