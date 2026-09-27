import { z } from "zod";

export const genreSchema = z.enum([
  "action",
  "adventure",
  "animation",
  "comedy",
  "crime",
  "documentary",
  "drama",
  "family",
  "fantasy",
  "history",
  "horror",
  "music",
  "mystery",
  "romance",
  "science_fiction",
  "tv_movie",
  "thriller",
  "war",
  "western",
]);

export type Genre = z.infer<typeof genreSchema>;

export const moodTagSchema = z.enum([
  "moving",
  "dark",
  "stylish",
  "hardboiled",
  "surreal",
  "poignant",
  "refreshing",
  "nostalgic",
  "epic",
  "tense",
  "cozy",
  "minimal",
  "experimental",
  "romantic",
  "disturbing",
  "heartwarming",
  "bitter_ending",
  "absurd",
]);

export type MoodTag = z.infer<typeof moodTagSchema>;

export const platformSchema = z.enum([
  "mubi",
  "netflix",
  "amazon_prime_video",
  "disney_plus",
  "apple_tv_plus",
  "max",
  "peacock",
  "paramount_plus",
  "criterion_channel",
  "shudder",
  "tubi",
  "pluto_tv",
  "roku_channel",
  "vrv",
  "bbc_iplayer",
  "channel_4",
  "itvx",
  "u_next",
  "hulu",
  "abema",
  "d_anime_store",
  "lemino",
  "fod",
  "paravi",
  "wowow_on_demand",
  "theater",
  "dvd_bluray",
  "tv_broadcast",
  "rental",
  "other",
]);

export type Platform = z.infer<typeof platformSchema>;

export const creditRoleSchema = z.enum([
  "director",
  "writer",
  "cinematographer",
  "composer",
  "cast",
]);

export type CreditRole = z.infer<typeof creditRoleSchema>;

export const scoreSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export type Score = z.infer<typeof scoreSchema>;

export const scores = [5, 4, 3, 2, 1] as const satisfies readonly Score[];
