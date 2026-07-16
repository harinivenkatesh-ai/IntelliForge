import type { Scheme } from "../types/scheme";
import { supabase } from "../lib/supabase";

export async function getAllSchemes(): Promise<Scheme[]> {
    const { data, error } = await supabase
        .from("schemes")
        .select("*")
        .order("name");

    if (error) throw error;

    return data ?? [];
}
export async function getSchemesByCategory(category: string): Promise<Scheme[]> {
    const { data, error } = await supabase
        .from("schemes")
        .select("*")
        .eq("category", category)
        .order("name");

    if (error) throw error;

    return data ?? [];
}
export async function matchSchemes(category: string): Promise<Scheme[]> {
    const { data, error } = await supabase
        .from("schemes")
        .select("*")
        .eq("category", category);

    if (error) throw error;

    return data ?? [];
}