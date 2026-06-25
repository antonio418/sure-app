async function test() {
  const payload = {
    supplementary_info: "Buscar empresas de China y Corea del sur",
    project_id: "ac1284eb-9763-48d7-9fdc-7c4d4571fd88",
    iteration: 1,
    limit: 20
  };

  console.log("Sending POST request to /api/alfredo with payload:", payload);
  try {
    const res = await fetch('http://localhost:3000/api/alfredo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const status = res.status;
    const text = await res.text();
    console.log("Response Status:", status);
    console.log("Response Body:", text);
  } catch (err) {
    console.error("Error making request:", err);
  }
}

test();
