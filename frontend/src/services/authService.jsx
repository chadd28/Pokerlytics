import supabase from '../supabase';

// Sign up user
export const registerUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
};

// Log in user
export const loginUser = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
};

// Log out user
export const logoutUser = async () => {
    await supabase.auth.signOut();
};
