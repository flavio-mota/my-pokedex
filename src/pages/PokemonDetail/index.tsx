
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { createStyles } from './styles';
import { useTheme } from '../../global/themes';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../routes';
import {
 fetchPokemonDetail,
 fetchPokemonSpecies,
 type PokemonDetailResponse,
 type PokemonSpeciesResponse,
} from '../../services/pokeapi';
import { isFavorite, toggleFavorite } from '../../services/favoritesStorage';
import { saveLastViewedPokemon } from '../../services/ultimoVisto';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


const TYPE_COLORS: Record<string, string> = {
 normal: '#A8A77A',
 fire: '#EE8130',
 water: '#6390F0',
 electric: '#F7D02C',
 grass: '#7AC74C',
 ice: '#96D9D6',
 fighting: '#C22E28',
 poison: '#A33EA1',
 ground: '#E2BF65',
 flying: '#A98FF3',
 psychic: '#F95587',
 bug: '#A6B91A',
 rock: '#B6A136',
 ghost: '#735797',
 dragon: '#6F35FC',
 dark: '#705746',
 steel: '#B7B7CE',
 fairy: '#D685AD',
};

export default function PokemonDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'PokemonDetail'>>();

function handleOpenCamera() {
  navigation.navigate('PokemonCamera', { id });
}

 const theme = useTheme();
 const styles = createStyles(theme);
 const route = useRoute<RouteProp<RootStackParamList, 'PokemonDetail'>>();
 const { id, photoUri: routePhotoUri, base64: routeBase64 } = route.params;

 const [pokemon, setPokemon] = useState<PokemonDetailResponse | null>(null);
 const [description, setDescription] = useState<string | null>(null);
 const [photoUri, setPhotoUri] = useState<string | null>(null);
 const [base64, setBase64] = useState<string | null>(null);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [favorite, setFavorite] = useState(false);
 const [favoriteLoading, setFavoriteLoading] = useState(true);

 function getPokemonDescriptionFromSpecies(
   species: PokemonSpeciesResponse,
 ): string | null {
   const ptEntry = species.flavor_text_entries.find(
     (entry) => entry.language.name === 'pt-br',
   );

   if (ptEntry) {
     return ptEntry.flavor_text.replace(/\s+/g, ' ').replace(/\f/g, ' ').trim();
   }

   const enEntry = species.flavor_text_entries.find(
     (entry) => entry.language.name === 'en',
   );

   if (enEntry) {
     return enEntry.flavor_text.replace(/\s+/g, ' ').replace(/\f/g, ' ').trim();
   }

   return null;
 }

 async function handleToggleFavorite() {
   if (!pokemon) return;

   const summary = {
     id: pokemon.id,
     name: pokemon.name,
     imageUrl:
       pokemon.sprites.front_default ??
       `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
     types: pokemon.types.map((t) => t.type.name),
   };

   const updated = await toggleFavorite(summary);
   setFavorite(updated.some((item) => item.id === pokemon.id));
 }

 async function persistLastViewed(detail: PokemonDetailResponse) {
   await saveLastViewedPokemon({
     id: detail.id,
     name: detail.name,
     imageUrl:
       detail.sprites.front_default ??
       `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${detail.id}.png`,
     types: detail.types.map((t) => t.type.name),
   });
 }

 useEffect(() => {
   setPhotoUri(routePhotoUri ?? null);
   setBase64(routeBase64 ?? null);
   console.log('PokemonDetail useEffect: routePhotoUri =', routePhotoUri, 'base64 =', !!routeBase64);

   const controller = new AbortController();

   async function loadPokemon() {
     try {
       setIsLoading(true);
       setError(null);

       const [detail, species] = await Promise.all([
         fetchPokemonDetail(id, { signal: controller.signal }),
         fetchPokemonSpecies(id, { signal: controller.signal }),
       ]);

       setPokemon(detail);
       setDescription(getPokemonDescriptionFromSpecies(species));
       await persistLastViewed(detail);
     } catch (e) {
       if ((e as Error).name !== 'AbortError') {
         setError('Nao foi possivel carregar os dados do pokemon.');
       }
     } finally {
       setIsLoading(false);
     }
   }

   async function loadFavoriteStatus() {
     try {
       const result = await isFavorite(id);
       setFavorite(result);
     } finally {
       setFavoriteLoading(false);
     }
   }

   loadPokemon();
   loadFavoriteStatus();

   return () => {
     controller.abort();
   };
 }, [id, routePhotoUri]);

 if (isLoading) {
   return (
     <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
       <ActivityIndicator size="large" color={theme.colors.primary} />
       <Text style={{ marginTop: 16, color: theme.colors.text }}>Carregando detalhes...</Text>
     </View>
   );
 }

 if (error || !pokemon) {
   return (
     <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
       <Text style={{ color: theme.colors.text, marginBottom: 16 }}>
         {error ?? 'Erro inesperado.'}
       </Text>
     </View>
   );
 }

 return (
   <ScrollView style={styles.container} contentContainerStyle={styles.content}>
     <View style={styles.header}>
       <View style={styles.nameRow}>
         <Text style={styles.name}>{pokemon.name}</Text>
         <Text style={styles.id}>#{String(pokemon.id).padStart(3, '0')}</Text>
       </View>

       <View style={styles.typeContainer}>
         {pokemon.types.map(({ type }) => (
           <View
             key={type.name}
             style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[type.name] ?? '#A8A8A8' }]}
           >
             <Text style={styles.typeText}>{type.name}</Text>
           </View>
         ))}
       </View>

       {pokemon.sprites.front_default ? (
         <Image source={{ uri: pokemon.sprites.front_default }} style={styles.image} />
       ) : null}

      
     </View>

    <TouchableOpacity
       onPress={handleToggleFavorite}
       disabled={favoriteLoading}
       style={{
         backgroundColor: favorite ? '#FFCB05' : '#E5E7EB',
         paddingHorizontal: 16,
         paddingVertical: 10,
         borderRadius: 999,
         alignSelf: 'flex-start',
         marginBottom: 16,
       }}
     >
       <Text style={{ fontWeight: '700', color: '#111827' }}>
         {favorite ? '★ Favorito' : '☆ Favoritar'}
       </Text>
     </TouchableOpacity>


    <TouchableOpacity
      onPress={handleOpenCamera}
      style={{
        backgroundColor: '#16a34a',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 999,
        alignSelf: 'flex-start',
        marginBottom: 16,
      }}
    >
      <Text style={{ fontWeight: '700', color: '#fff' }}>Abrir câmera</Text>
    </TouchableOpacity>

    {photoUri ? (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Foto capturada</Text>
        <Image source={{ uri: photoUri }} style={[styles.image, { width: 220, height: 220 }]} />
      </View>
    ) : null}

    <View style={styles.section}>
       <Text style={styles.sectionTitle}>Sobre</Text>
       <Text style={styles.sectionText}>{description ?? 'Descricao nao disponivel.'}</Text>
     </View>

     <View style={styles.section}>
       <Text style={styles.sectionTitle}>Informacoes basicas</Text>
       <View style={styles.infoRow}>
         <Text style={styles.infoLabel}>Altura</Text>
         <Text style={styles.infoValue}>{pokemon.height / 10} m</Text>
       </View>
       <View style={styles.infoRow}>
         <Text style={styles.infoLabel}>Peso</Text>
         <Text style={styles.infoValue}>{pokemon.weight / 10} kg</Text>
       </View>
     </View>

     <View style={styles.section}>
       <Text style={styles.sectionTitle}>Stats base</Text>
       {pokemon.stats.map((stat) => (
         <View key={stat.stat.name} style={styles.statRow}>
           <Text style={styles.statName}>{stat.stat.name.toUpperCase()}</Text>
           <Text style={styles.statValue}>{stat.base_stat}</Text>
         </View>
       ))}
     </View>
   </ScrollView>
 );
}