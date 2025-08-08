const directionsAPI = process.env.REACT_APP_EXPO_GOOGLE_API_KEY;
// this have 3 differnet functions and we are exporting them
export function generateMarkersFromData({ data, userLatitude, userLongitude }) 
{
  // given data & latitude & longitudee , we are making new markers near it
  return data.map((driver) => {
    const latOffset = (Math.random() - 0.5) * 0.01; 
    const lngOffset = (Math.random() - 0.5) * 0.01;

    return {
      latitude: userLatitude + latOffset,
      longitude: userLongitude + lngOffset,
      title: `${driver.first_name} ${driver.last_name}`,
      ...driver,
    };
  });
}

export function calculateRegion({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}) {
  if (userLatitude == null || userLongitude == null) {
    return {
      latitude: 17.982609738462155,
      longitude: 79.53627788922866,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  if (destinationLatitude == null || destinationLongitude == null) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  const latitudeDelta = (maxLat - minLat) * 1.3;
  const longitudeDelta = (maxLng - minLng) * 1.3;

  return {
    latitude: (userLatitude + destinationLatitude) / 2,
    longitude: (userLongitude + destinationLongitude) / 2,
    latitudeDelta,
    longitudeDelta,
  };
}


export async function calculateDriverTimes({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}) {
  if (
    userLatitude == null ||
    userLongitude == null ||
    destinationLatitude == null ||
    destinationLongitude == null
  ) {
    return [];
  }

  try {
    const timesPromises = markers.map(async (marker) => {
      // Time from driver to user
      const resp1 = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${marker.latitude},${marker.longitude}&destination=${userLatitude},${userLongitude}&key=${directionsAPI}`
      );
      const data1 = await resp1.json();
      const timeToUser = data1.routes[0].legs[0].duration.value;

      // Time from user to destination
      const resp2 = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=${destinationLatitude},${destinationLongitude}&key=${directionsAPI}`
      );
      const data2 = await resp2.json();
      const timeToDest = data2.routes[0].legs[0].duration.value;

      const totalMinutes = (timeToUser + timeToDest) / 60;
      const price = (totalMinutes * 0.5).toFixed(2);

      return { ...marker, time: totalMinutes, price };
    });

    return await Promise.all(timesPromises);
  } catch (err) {
    console.error('Error calculating driver times:', err);
    return [];
  }
}
