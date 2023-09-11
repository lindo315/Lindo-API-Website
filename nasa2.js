async function fetchDataAndProcess() {
  try {
    const url = 'https://api.nasa.gov/DONKI/FLR?startDate=yyyy-MM-dd&endDate=yyyy-MM-dd&api_key=FYw9fNRv8ac2av2x7fDwTIpfoxqIdBWiQ6TbM7u9';
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const data = await response.json();

    data.forEach(item => {
      const flareClassType = item.classType;
      const beginTime = item.beginTime;
      const peakTime = item.peakTime;
      const endTime = item.endTime;

      console.log(`Class Type: ${flareClassType}`);
      console.log(`Begin Time: ${beginTime}`);
      console.log(`Peak Time: ${peakTime}`);
      console.log(`End Time: ${endTime}`);
    });

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchDataAndProcess();


var prevScroll = window.pageYOffset;