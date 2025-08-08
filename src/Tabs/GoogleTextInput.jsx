import  { useRef, useEffect } from "react";

const GoogleTextInput = ({ onPlaceSelected }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (onPlaceSelected) onPlaceSelected(place);
    });
  }, []);

  return (
    <div className="flex justify-center items-center p-2 rounded-xl shadow-md bg-white">
      <input
        ref={inputRef}
        type="text"
        placeholder="Where you want to go?"
        className="w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
  );
};

export default GoogleTextInput;
