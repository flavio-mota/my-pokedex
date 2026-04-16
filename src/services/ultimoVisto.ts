
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_VIEWED_KEY = '@mypokedex/lastViewed:v1';

export type LastViewedPokemon = {
 id: number;
 name: string;
 imageUrl: string;
 types: string[];
 savedAt: string;
};

export async function getLastViewedPokemon(): Promise<LastViewedPokemon | null> {
 const raw = await AsyncStorage.getItem(LAST_VIEWED_KEY);
 if (!raw) return null;
 return JSON.parse(raw) as LastViewedPokemon;
}

export async function saveLastViewedPokemon(
 pokemon: Omit<LastViewedPokemon, 'savedAt'>,
): Promise<LastViewedPokemon> {
 const payload: LastViewedPokemon = {
   ...pokemon,
   savedAt: new Date().toISOString(),
 };

 await AsyncStorage.setItem(LAST_VIEWED_KEY, JSON.stringify(payload));
 return payload;
}

export async function clearLastViewedPokemon(): Promise<void> {
 await AsyncStorage.removeItem(LAST_VIEWED_KEY);
}
