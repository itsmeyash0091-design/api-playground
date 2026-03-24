document.addEventListener('DOMContentLoaded', () => {
    const dogContent = document.getElementById('dog-content');
    const getDogBtn = document.getElementById('get-dog-btn');
    const copyDogUrlBtn = document.getElementById('copy-dog-url-btn');
    const jokeContent = document.getElementById('joke-content');
    const getJokeBtn = document.getElementById('get-joke-btn');
    const nextJokeBtn = document.getElementById('next-joke-btn');
    const userContent = document.getElementById('user-content');
    const getUserBtn = document.getElementById('get-user-btn');
    const jsonContent = document.getElementById('json-content');
    const getJsonBtn = document.getElementById('get-json-btn');
    const jsonEndpointSelect = document.getElementById('json-endpoint');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    let currentDogUrl = '';

    const showToast = (message) => {
        toastMessage.textContent = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    };

    const setLoading = (container) => {
        container.innerHTML = `<div class="loading"></div><p style="color:#94a3b8;font-size:0.9rem">Fetching data...</p>`;
    };

    const setError = (container, message) => {
        container.innerHTML = `<ion-icon name="alert-circle-outline" class="placeholder-icon" style="color: #f43f5e; opacity:0.8"></ion-icon><p style="color: #f87171; font-weight:500">${message}</p>`;
    };

    const parseBreed = (url) => {
        const match = url.match(/breeds\/([^/]+)\//);
        return match ? match[1].split('-').reverse().join(' ') : 'Unknown Breed';
    };

    const fetchDog = async () => {
        setLoading(dogContent);
        try {
            const res = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await res.json();
            currentDogUrl = data.message;
            dogContent.innerHTML = `<img src="${currentDogUrl}" class="dog-image"><span class="breed-badge">${parseBreed(currentDogUrl)}</span>`;
            copyDogUrlBtn.disabled = false;
        } catch (e) { setError(dogContent, 'Failed to fetch dog.'); }
    };

    const fetchJoke = async () => {
        setLoading(jokeContent);
        try {
            const res = await fetch('https://official-joke-api.appspot.com/random_joke');
            const data = await res.json();
            jokeContent.innerHTML = `<div class="joke-box"><p class="joke-setup">${data.setup}</p><div class="joke-punchline">${data.punchline}</div></div>`;
            nextJokeBtn.disabled = false;
        } catch (e) { setError(jokeContent, 'No jokes found.'); }
    };

    const fetchUser = async () => {
        setLoading(userContent);
        try {
            const res = await fetch('https://randomuser.me/api/');
            const data = await res.json();
            const u = data.results[0];
            userContent.innerHTML = `
                <div class="user-profile">
                    <img src="${u.picture.large}" class="user-photo" alt="User photo">
                    <h4 class="user-name">${u.name.first} ${u.name.last}</h4>
                    <p class="user-email">${u.email}</p>
                    <div class="user-details">
                        <div class="detail-item"><ion-icon name="earth"></ion-icon> ${u.location.country}</div>
                        <div class="detail-item"><ion-icon name="call"></ion-icon> ${u.phone.split(' ')[0]}</div>
                    </div>
                </div>`;
        } catch (e) { setError(userContent, 'User not found.'); }
    };

    const fetchJson = async () => {
        setLoading(jsonContent);
        const ep = jsonEndpointSelect.value;
        try {
            const res = await fetch(`https://jsonplaceholder.typicode.com/${ep}?_limit=3`);
            const data = await res.json();
            jsonContent.innerHTML = `<div class="json-response"><pre class="json-pre">${JSON.stringify(data, null, 2)}</pre></div>`;
            showToast(`Loaded ${ep}`);
        } catch (e) { setError(jsonContent, 'Fetch failed.'); }
    };

    // Card spotlight mouse-tracking effect
    document.querySelectorAll('.api-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    getDogBtn.addEventListener('click', fetchDog);
    copyDogUrlBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(currentDogUrl);
        showToast('URL Copied!');
    });
    getJokeBtn.addEventListener('click', fetchJoke);
    nextJokeBtn.addEventListener('click', fetchJoke);
    getUserBtn.addEventListener('click', fetchUser);
    getJsonBtn.addEventListener('click', fetchJson);
});
