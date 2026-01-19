async function check() {
    try {
        console.log('Fetching tags with type=events...');
        const res = await fetch('http://localhost:3001/api/tags?type=events');
        console.log('Response status:', res.status);
        const data = await res.json();
        console.log('Response data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

check();
