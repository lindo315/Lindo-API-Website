async function fetchDataAndProcess() {
  try {
    const url = 'https://api.nasa.gov/DONKI/FLR?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=FYw9fNRv8ac2av2x7fDwTIpfoxqIdBWiQ6TbM7u9';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();

    // Access and process the 'classType' data
    data.forEach(item => {
      const flareClassType = item.classType;
      console.log(flareClassType); // Log the 'classType' for each object in the array
      // You can perform further processing or visualization here
    });

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchDataAndProcess();



var prevScroll = window.pageYOffset;


