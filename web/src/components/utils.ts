async function FetchVehiclesData() {
    const headers = {};

    const response = await fetch('https://raw.githubusercontent.com/DurtyFree/gta-v-data-dumps/refs/heads/master/vehicles.json', {
        headers: headers,
    });

    if (response.status === 304) {
        return;
    }

    if (!response.ok) throw new Error(response.statusText);

    const data = await response.json();

    return data
};

export const Vehicles = await FetchVehiclesData();

export function checkImageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}