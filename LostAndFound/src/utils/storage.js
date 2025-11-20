import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for AsyncStorage
const KEYS = {
  USER_DATA: '@user_data',
  LOST_ITEMS: '@lost_items',
  FOUND_ITEMS: '@found_items',
  ALL_USERS: '@all_users',
};

// User Authentication Functions
export const saveUser = async (userData) => {
  try {
    await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(userData));
    
    // Also save to all users list
    const allUsers = await getAllUsers();
    const existingIndex = allUsers.findIndex(u => u.email === userData.email);
    if (existingIndex >= 0) {
      allUsers[existingIndex] = userData;
    } else {
      allUsers.push(userData);
    }
    await AsyncStorage.setItem(KEYS.ALL_USERS, JSON.stringify(allUsers));
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
};

export const getUser = async () => {
  try {
    const userData = await AsyncStorage.getItem(KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const users = await AsyncStorage.getItem(KEYS.ALL_USERS);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.USER_DATA);
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
};

export const validateEmail = (email) => {
  const nieEmailRegex = /^[a-zA-Z0-9._%+-]+@nie\.ac\.in$/;
  return nieEmailRegex.test(email);
};

export const registerUser = async (name, email, password) => {
  if (!validateEmail(email)) {
    return { success: false, message: 'Please use a valid @nie.ac.in email address' };
  }

  const allUsers = await getAllUsers();
  const existingUser = allUsers.find(u => u.email === email);
  
  if (existingUser) {
    return { success: false, message: 'Email already registered' };
  }

  const userData = {
    id: Date.now().toString(),
    name,
    email,
    password, // In production, this should be hashed
    createdAt: new Date().toISOString(),
  };

  const saved = await saveUser(userData);
  if (saved) {
    return { success: true, user: userData };
  }
  return { success: false, message: 'Failed to register user' };
};

export const loginUser = async (email, password) => {
  if (!validateEmail(email)) {
    return { success: false, message: 'Please use a valid @nie.ac.in email address' };
  }

  const allUsers = await getAllUsers();
  const user = allUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    await AsyncStorage.setItem(KEYS.USER_DATA, JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, message: 'Invalid email or password' };
};

// Lost and Found Items Functions
export const saveLostItem = async (item) => {
  try {
    const items = await getLostItems();
    const newItem = {
      ...item,
      id: Date.now().toString(),
      type: 'lost',
      createdAt: new Date().toISOString(),
    };
    items.push(newItem);
    await AsyncStorage.setItem(KEYS.LOST_ITEMS, JSON.stringify(items));
    return { success: true, item: newItem };
  } catch (error) {
    console.error('Error saving lost item:', error);
    return { success: false, message: 'Failed to save item' };
  }
};

export const saveFoundItem = async (item) => {
  try {
    const items = await getFoundItems();
    const newItem = {
      ...item,
      id: Date.now().toString(),
      type: 'found',
      createdAt: new Date().toISOString(),
    };
    items.push(newItem);
    await AsyncStorage.setItem(KEYS.FOUND_ITEMS, JSON.stringify(items));
    return { success: true, item: newItem };
  } catch (error) {
    console.error('Error saving found item:', error);
    return { success: false, message: 'Failed to save item' };
  }
};

export const getLostItems = async () => {
  try {
    const items = await AsyncStorage.getItem(KEYS.LOST_ITEMS);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error getting lost items:', error);
    return [];
  }
};

export const getFoundItems = async () => {
  try {
    const items = await AsyncStorage.getItem(KEYS.FOUND_ITEMS);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error getting found items:', error);
    return [];
  }
};

export const deleteItem = async (itemId, type) => {
  try {
    const key = type === 'lost' ? KEYS.LOST_ITEMS : KEYS.FOUND_ITEMS;
    const items = type === 'lost' ? await getLostItems() : await getFoundItems();
    const filteredItems = items.filter(item => item.id !== itemId);
    await AsyncStorage.setItem(key, JSON.stringify(filteredItems));
    return { success: true };
  } catch (error) {
    console.error('Error deleting item:', error);
    return { success: false, message: 'Failed to delete item' };
  }
};
