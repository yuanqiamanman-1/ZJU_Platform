async function check() {
    try {
        console.log('Fetching tags without type...');
        const res = await fetch('http://localhost:3001/api/tags');
        console.log('Response status:', res.status);
        const data = await res.json();
        const cyberpunk = data.find(t => t.name === '赛博朋克');
        console.log('Cyberpunk tag found:', cyberpunk);
    } catch (error) {
        console.error('Error:', error);
    }
}

check();
