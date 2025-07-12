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