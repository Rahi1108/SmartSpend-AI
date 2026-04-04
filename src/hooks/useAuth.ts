import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated,
    initialize,
    login,
    register,
    logout,
    updateProfile,
  } = useAuthStore();

  return {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated,
    initialize,
    login,
    register,
    logout,
    signOut: logout,
    updateProfile,
  };
};
