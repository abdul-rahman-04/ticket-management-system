document.addEventListener('DOMContentLoaded', async () => {
  // Populate source and destination dropdowns on page load
  await populateDropdown('source');
  await populateDropdown('destination');

  // Add an event listener for the "Search Routes" button
  const searchButton = document.querySelector('button');
  searchButton.addEventListener('click', redirectPage);
});

async function populateDropdown(dropdownId) {
  // Fetch source-destination pairs from the server
  const sourceDestinationResponse = await fetch('/api/source-destinations');
  const { sourceDestinations } = await sourceDestinationResponse.json();

  // Populate the dropdown menu
  const dropdown = document.getElementById(dropdownId);
  sourceDestinations.forEach(({ source, destination }) => {
    const option = document.createElement('option');
    if (dropdownId === 'source') {
      option.value = `${source}`;
      option.text = `${source}`;
    } else {
      option.value = `${destination}`;
      option.text = `${destination}`;
    }
    dropdown.add(option);
  });
}

async function redirectPage() {
  // Get the selected source, destination, and travel date
  const source = document.getElementById('source').value;
  const destination = document.getElementById('destination').value;
  const travelDate = document.getElementById('travel-date').value;

  // Redirect to the new page with query parameters
  window.location.href = `./src/searchResults.html?source=${source}&destination=${destination}&travelDate=${travelDate}`;
}