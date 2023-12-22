import type { Database } from "../types";

// Read Row
export type ITrainer = Database["public"]["Tables"]["trainers"]["Row"]
export type IPokemon = Database["public"]["Tables"]["pokemon"]["Row"]
export type ITeam = Database["public"]["Tables"]["teams"]["Row"]
export type IGym = Database["public"]["Tables"]["gyms"]["Row"]

export type IDraft = Database["public"]["Tables"]["drafts"]["Row"]

// Insert Row
export type INewTrainer = Database['public']['Tables']['trainers']['Insert']
export type INewPokemon = Database['public']['Tables']['pokemon']['Insert']
export type INewTeam = Database['public']['Tables']['teams']['Insert']

// Update Row
export type IUpdateTeam = Database['public']['Tables']['teams']['Update']