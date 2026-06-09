// Supabase is no longer used - all API calls go through Django backend
// This file is kept as a stub to prevent import errors

export const supabase = {
  auth: {
    signInWithPassword: async () => ({
      data: null,
      error: new Error("Use Django API"),
    }),
    signOut: async () => {},
    getUser: async () => ({ data: { user: null } }),
    getSession: async () => ({ data: { session: null } }),
    refreshSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({ single: async () => ({ data: null, error: null }) }),
    }),
    insert: () => ({
      select: () => ({ single: async () => ({ data: null, error: null }) }),
    }),
    update: () => ({
      eq: () => ({
        select: () => ({ single: async () => ({ data: null, error: null }) }),
      }),
    }),
    delete: () => ({ eq: async () => ({ data: null, error: null }) }),
  }),
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: new Error("Use Django API") }),
      getPublicUrl: () => ({ data: { publicUrl: "" } }),
    }),
  },
};
