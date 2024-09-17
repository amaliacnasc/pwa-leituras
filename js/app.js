document.getElementById('form-leitura').addEventListener('submit', async function(event) {
    event.preventDefault();

    const livro = document.getElementById('livro').value;
    const autor = document.getElementById('autor').value;
    const paginas = document.getElementById('paginas').value;
    const resumo = document.getElementById('resumo').value;
    const photoInput = document.getElementById('photo');
    const photo = await convertImageToBase64(photoInput.files[0]);


        try {
            const response = await fetch('https://api-leituras.onrender.com/api/leituras', { // Certifique-se de que a rota da API está correta
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ livro, autor, paginas, resumo, photo })
            });

            if (response.ok) {
                document.getElementById('form-leitura').reset(); // limpando formulario 
                fetchLivros();
            } else {
                console.error('Erro ao adicionar leitura:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao conectar com a API:', error);
        }
    });

async function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function fetchLivros() {
    try {
        const response = await fetch('https://api-leituras.onrender.com/api/leituras'); // Certifique-se de que a rota da API está correta
        if (!response.ok) {
            throw new Error('Erro ao buscar leituras');
        }
        const plantations = await response.json();
        const list = document.getElementById('lista-livros');
        list.innerHTML = '';
        plantations.forEach(p => {
            const item = document.createElement('div');
            item.innerHTML = `
                <h3>${p.name}</h3>
                <p>${p.description}</p>
                <img src="${p.photo}" alt="${p.name}" style="max-width: 100%; height: auto;">
            `;
            list.appendChild(item);
        });
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
    }
}

fetchLivros();