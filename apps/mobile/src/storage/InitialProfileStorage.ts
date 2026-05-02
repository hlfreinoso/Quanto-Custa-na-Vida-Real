import AsyncStorage from "@react-native-async-storage/async-storage";

const INITIAL_PROFILE_STORAGE_KEY = "@quanto-custa/initial-profile";

export interface InitialProfile {
  monthlyIncome: string;
  selectedComparisonIds: string[];
}

export async function loadInitialProfile(): Promise<InitialProfile | null> {
  const storedProfile = await AsyncStorage.getItem(INITIAL_PROFILE_STORAGE_KEY);

  if (!storedProfile) {
    return null;
  }

  return JSON.parse(storedProfile) as InitialProfile;
}

export async function saveInitialProfile(
  profile: InitialProfile,
): Promise<void> {
  await AsyncStorage.setItem(
    INITIAL_PROFILE_STORAGE_KEY,
    JSON.stringify(profile),
  );
}
