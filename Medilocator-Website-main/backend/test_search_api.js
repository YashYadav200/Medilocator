
const testSearch = async () => {
    try {
        const url = "http://127.0.0.1:5001/api/search/medicine?state=Uttar%20Pradesh&district=Kanpur&area=Civil%20Lines&medicine=Paracetamol";
        console.log(`Fetching: ${url}`);
        const res = await fetch(url);
        const data = await res.json();
        console.log("Response Data:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error:", error.message);
    }
};

setTimeout(testSearch, 2000);
