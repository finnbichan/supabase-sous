import { View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator, FlatList, Image, TextInput, StyleSheet } from 'react-native';
import React, { useEffect, useState, useContext, useMemo, useRef } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import useStyles from '../styles/Common';
import Recipe from '../components/RecipeBase';
import { supabase } from '../../supabase';
import { AuthContext, CacheContext } from '../../Contexts';
import { useTheme } from '@react-navigation/native';
import AppHeaderText from '../components/AppHeaderText';
import Dropdown from '../components/Dropdown';

const HEART_LIKED = require('../../assets/heart_liked.png');
const DOTS_ICON = require('../../assets/dark/dots.png');

const ExploreEmpty = () => {
    const styles = useStyles();

    return (
        <View style={{ paddingVertical: 16 }}>
            <Text style={styles.lowImpactText}>No matching recipes right now.</Text>
        </View>
    );
};

const ExploreFooter = ({ loadingMore, hasMore }) => {
    const styles = useStyles();

    if (loadingMore) {
        return (
            <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <View style={{ paddingVertical: 20 }}>
            <Text style={styles.lowImpactText}>{hasMore ? 'Scroll for more recipes.' : 'No more suggestions!'}</Text>
        </View>
    );
};

const ExploreHeader = ({
    searchText,
    setSearchText,
    filtersOpen,
    setFiltersOpen,
    cuisineFilter,
    setCuisineFilter,
    timeFilter,
    setTimeFilter,
    vegetarianFilter,
    setVegetarianFilter
}) => {
    const { assets, colours } = useTheme();
    const styles = useStyles();
    const cuisineOptions = [{ id: 0, label: 'Any' }, ...cuisineList.map((item, index) => ({ id: index + 1, label: item.label }))];
    const timeOptions = [{ id: 0, label: 'Any' }, ...easeList.map((item, index) => ({ id: index + 1, label: item.label }))];
    const vegetarianOptions = [{ id: 0, label: 'Any' }, { id: 1, label: 'Veggie' }, { id: 2, label: 'Vegan' }];

    return (
        <View style={{ width: '100%', paddingHorizontal: 8, paddingTop: 10 }}>
            <View style={{ paddingBottom: 10 }}>
                <AppHeaderText>Explore recipes</AppHeaderText>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
                <TextInput
                style={{ paddingHorizontal: 10, backgroundColor: colours.card, flexGrow: 1, borderRadius: 8, marginRight: 16, color: colours.text, alignContent: 'center' }}
                placeholder="Search"
                placeholderTextColor={colours.secondaryText}
                value={searchText}
                onChangeText={setSearchText}
                />
                <TouchableOpacity onPress={() => setFiltersOpen(!filtersOpen)}>
                    <Image
                    source={assets.filter}
                    style={styles.icon}
                    />
                </TouchableOpacity>
            </View>
            {filtersOpen ? (
                <View style={{ paddingVertical: 4, marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Dropdown
                        data={cuisineOptions}
                        label="Cuisine"
                        onSelect={(selected) => setCuisineFilter(selected.id)}
                        value={cuisineFilter === 0 ? undefined : cuisineFilter}
                        compact={true}
                        style={{ marginRight: 8 }}
                        />
                        <Dropdown
                        data={timeOptions}
                        label="Time"
                        onSelect={(selected) => setTimeFilter(selected.id)}
                        value={timeFilter === 0 ? undefined : timeFilter}
                        compact={true}
                        style={{ marginRight: 8 }}
                        />
                        <Dropdown
                        data={vegetarianOptions}
                        label="Diet"
                        onSelect={(selected) => setVegetarianFilter(selected.id)}
                        value={vegetarianFilter === 0 ? undefined : vegetarianFilter}
                        compact={true}
                        />
                    </View>
                </View>
            ) : null}
        </View>
    );
};

const ExploreCard = ({ item, navigation }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const styles = useStyles();
    const { assets, colours } = useTheme();
    const { setCache } = useContext(CacheContext);
    const session = useContext(AuthContext);
    const cardStyles = StyleSheet.create({
        shell: {
            marginBottom: 18,
            borderRadius: 18,
            overflow: 'hidden',
            backgroundColor: colours.card
        },
        image: {
            width: '100%',
            height: 240,
            backgroundColor: colours.card
        },
        imageFallback: {
            width: '100%',
            height: 180,
            backgroundColor: colours.card,
            alignItems: 'center',
            justifyContent: 'center'
        },
        card: {
            backgroundColor: colours.card,
            padding: 14
        },
        imageOverlay: {
            position: 'absolute',
            top: 14,
            right: 14,
            alignItems: 'center'
        },
        cardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 12
        },
        content: {
            flex: 1
        },
        meta: {
            marginTop: 8
        },
        creator: {
            color: colours.text,
            marginBottom: 6
        },
        description: {
            color: colours.secondaryText
        },
        actions: {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        },
        iconButton: {
            padding: 6,
            marginBottom: 10,
            borderRadius: 999,
            backgroundColor: 'rgba(0, 0, 0, 0.35)'
        },
        icon: {
            width: 28,
            height: 28
        },
        chevron: {
            width: 24,
            height: 24,
            marginLeft: 8,
            alignSelf: 'center'
        }
    });

    const like = async () => {
        const { data, error } = await supabase
        .from('likedrecipes')
        .insert({
            recipe_id: item.recipe_id,
            user_id: session.user.id,
            active: 1
        });

        if (error) {
            console.log(error);
            return false;
        }

        setCache(data);
        return true;
    };

    const unlike = async () => {
        const { data, error } = await supabase
        .from('likedrecipes')
        .delete()
        .match({ recipe_id: item.recipe_id, user_id: session.user.id });

        if (error) {
            console.log(error);
            return false;
        }

        setCache(item);
        return true;
    };

    const handleLike = async () => {
        if (isLikeLoading) {
            return;
        }

        setIsLikeLoading(true);
        const wasLiked = isLiked;
        setIsLiked(!wasLiked);

        const success = wasLiked ? await unlike() : await like();
        if (!success) {
            setIsLiked(wasLiked);
        }
        setIsLikeLoading(false);
    };

    return (
        <View style={cardStyles.shell}>
            <TouchableOpacity activeOpacity={0.92} onPress={() => navigation.navigate('Recipe', { prevScreen: 'Explore', recipe: item })}>
                {item.image_uri ? (
                    <Image
                    source={{ uri: item.image_uri }}
                    style={cardStyles.image}
                    />
                ) : (
                    <View style={cardStyles.imageFallback}>
                        <Text style={styles.lowImpactText}>No image</Text>
                    </View>
                )}
                <View style={cardStyles.imageOverlay}>
                    <View style={cardStyles.actions}>
                        <TouchableOpacity
                        onPress={handleLike}
                        style={cardStyles.iconButton}
                        disabled={isLikeLoading}
                        >
                            <Image source={isLiked ? HEART_LIKED : assets.heart} style={cardStyles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={() => { console.log('explore recipe menu'); }}
                        style={[cardStyles.iconButton, { marginBottom: 0 }]}
                        >
                            <Image source={DOTS_ICON} style={cardStyles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={cardStyles.card}>
                    <View style={cardStyles.cardHeader}>
                        <View style={cardStyles.content}>
                            <Recipe
                            recipe={item}
                            />
                            <View style={cardStyles.meta}>
                                <Text style={cardStyles.creator}>by {item.display_name}</Text>
                                <Text style={cardStyles.description}>
                                    {item.description || 'No description added'}
                                </Text>
                            </View>
                        </View>
                        <Image source={assets.chevron_right} style={cardStyles.chevron} />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const Explore = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [headerVisible, setHeaderVisible] = useState(true);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [recipes, setRecipes] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [cuisineFilter, setCuisineFilter] = useState(0);
    const [timeFilter, setTimeFilter] = useState(0);
    const [vegetarianFilter, setVegetarianFilter] = useState(0);
    const styles = useStyles();
    const session = useContext(AuthContext);
    const lastScrollOffset = useRef(0);
    const downwardTravel = useRef(0);
    const upwardTravel = useRef(0);
    const headerVisibility = useSharedValue(1);

    useEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    useEffect(() => {
        headerVisibility.value = withTiming(headerVisible ? 1 : 0, { duration: 300 });
    }, [headerVisible, headerVisibility]);

    const mergeRecipes = (currentRecipes, nextRecipes) => {
        const recipeMap = new Map(currentRecipes.map((recipe) => [String(recipe.recipe_id), recipe]));
        nextRecipes.forEach((recipe) => {
            recipeMap.set(String(recipe.recipe_id), recipe);
        });
        return Array.from(recipeMap.values());
    };

    const fetchRecipes = async ({ append = false, alreadyOnPage = [0] } = {}) => {
        const { data, error } = await supabase
        .rpc('explore_recipes', { p_user_id: session.user.id, already_on_page: alreadyOnPage });

        if (error) {
            console.log(error);
            return;
        }

        const nextRecipes = data || [];

        if (append) {
            setRecipes((currentRecipes) => mergeRecipes(currentRecipes, nextRecipes));
            if (nextRecipes.length === 0) {
                setHasMore(false);
            }
            return;
        }

        setRecipes(nextRecipes);
        setHasMore(nextRecipes.length > 0);
    };

    useEffect(() => {
        const loadInitialRecipes = async () => {
            setLoading(true);
            setHasMore(true);
            await fetchRecipes();
            setLoading(false);
        };

        loadInitialRecipes();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        setHasMore(true);
        await fetchRecipes();
        setRefreshing(false);
    };

    const loadMore = async () => {
        if (loading || refreshing || loadingMore || !hasMore || recipes.length === 0) {
            return;
        }

        setLoadingMore(true);
        await fetchRecipes({
            append: true,
            alreadyOnPage: recipes.map((recipe) => recipe.recipe_id)
        });
        setLoadingMore(false);
    };

    const handleScroll = (event) => {
        const currentOffset = event.nativeEvent.contentOffset.y;

        if (currentOffset <= 0) {
            setHeaderVisible(true);
            lastScrollOffset.current = 0;
            downwardTravel.current = 0;
            upwardTravel.current = 0;
            return;
        }

        const offsetDelta = currentOffset - lastScrollOffset.current;
        if (Math.abs(offsetDelta) < 2) {
            lastScrollOffset.current = currentOffset;
            return;
        }

        if (offsetDelta > 0) {
            downwardTravel.current += offsetDelta;
            upwardTravel.current = 0;
        } else {
            upwardTravel.current += Math.abs(offsetDelta);
            downwardTravel.current = 0;
        }

        if (downwardTravel.current > 24 && headerVisible && currentOffset > (headerHeight || 0)) {
            setHeaderVisible(false);
            downwardTravel.current = 0;
        } else if (upwardTravel.current > 12 && !headerVisible) {
            setHeaderVisible(true);
            upwardTravel.current = 0;
        }

        lastScrollOffset.current = currentOffset;
    };

    const headerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: headerVisibility.value,
        transform: [{ translateY: -1 * headerHeight * (1 - headerVisibility.value) }]
    }), [headerHeight]);

    const filteredRecipes = useMemo(() => {
        const normalizedSearchText = searchText.trim().toLowerCase();

        return recipes.filter((recipe) => {
            const matchesSearch = !normalizedSearchText
                || recipe.name?.toLowerCase().includes(normalizedSearchText)
                || recipe.display_name?.toLowerCase().includes(normalizedSearchText)
                || recipe.description?.toLowerCase().includes(normalizedSearchText);
            const matchesCuisine = cuisineFilter === 0 || Number(recipe.cuisine) === cuisineFilter - 1;
            const matchesTime = timeFilter === 0 || Number(recipe.ease) === timeFilter - 1;
            const matchesVegetarian = vegetarianFilter === 0 || Number(recipe.diet) === vegetarianFilter;

            return matchesSearch && matchesCuisine && matchesTime && matchesVegetarian;
        });
    }, [recipes, searchText, cuisineFilter, timeFilter, vegetarianFilter]);

    const renderRecipe = ({ item }) => (
        <ExploreCard
        item={item}
        navigation={navigation}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.content, { flex: 1, width: '100%' }]}>
                <Animated.View
                style={[
                    {
                        width: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 10
                    },
                    headerAnimatedStyle
                ]}
                pointerEvents={headerVisible ? 'auto' : 'none'}
                >
                    <View
                    onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
                    style={{ backgroundColor: styles.container.backgroundColor }}
                    >
                        <ExploreHeader
                        searchText={searchText}
                        setSearchText={setSearchText}
                        filtersOpen={filtersOpen}
                        setFiltersOpen={setFiltersOpen}
                        cuisineFilter={cuisineFilter}
                        setCuisineFilter={setCuisineFilter}
                        timeFilter={timeFilter}
                        setTimeFilter={setTimeFilter}
                        vegetarianFilter={vegetarianFilter}
                        setVegetarianFilter={setVegetarianFilter}
                        />
                    </View>
                </Animated.View>
                {loading ? (
                    <View style={{ width: '100%', flex: 1, justifyContent: 'center', paddingTop: 40 }}>
                        <ActivityIndicator size="large" />
                    </View>
                ) : (
                    <FlatList
                    data={filteredRecipes}
                    renderItem={renderRecipe}
                    keyExtractor={(item) => item.recipe_id}
                    style={[styles.recipeList, { width: '100%', paddingHorizontal: 0 }]}
                    contentContainerStyle={{ paddingTop: headerHeight, paddingHorizontal: 8, paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.4}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    ListEmptyComponent={<ExploreEmpty />}
                    ListFooterComponent={<ExploreFooter loadingMore={loadingMore} hasMore={hasMore} />}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

export default Explore;
