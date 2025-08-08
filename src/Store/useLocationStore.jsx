// src/store/useLocationStore.js
import { create } from 'zustand';

const useLocationStore = create((set) => ({
  userLatitude: null,
  userLongitude: null,   
  userAddress: null,
  destinationLatitude: null,
  destinationLongitude: null,
  destinationAddress: null,

  setUserLocation: ({ latitude, longitude, address }) =>
    set(() => ({
      userLatitude: latitude,
      userLongitude: longitude,
      userAddress: address,
    })),

  setDestinationLocation: ({ latitude, longitude, address }) =>
    set(() => ({
      destinationLatitude: latitude,
      destinationLongitude: longitude,
      destinationAddress: address,
    })),
}));

export default useLocationStore;
