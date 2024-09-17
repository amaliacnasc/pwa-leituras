document.getElementById('form-leitura').addEventListener('submit', async function(event) {
    event.preventDefault();

    const livro = document.getElementById('livro').value;
    const autor = document.getElementById('autor').value;
    const paginas = document.getElementById('paginas').value;
    const resumo = document.getElementById('resumo').value;

    const photoInput = document.getElementById('photo');
    const photo = await convertImageToBase64(photoInput.files[0]);

    try {
        const response = await fetch('https://api-leituras.onrender.com/api/leituras', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ livro, autor, paginas, resumo, photo })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Livro adicionado com sucesso:', result);
            document.getElementById('form-leitura').reset(); // limpando o formulário
            fetchLivros(); // Recarrega a lista de livros
        } else {
            const errorDetails = await response.json();
            console.error('Erro ao adicionar leitura:', errorDetails.message);
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
        const response = await fetch('https://api-leituras.onrender.com/api/leituras');
        if (!response.ok) {
            throw new Error('Erro ao buscar leituras');
        }
        const livros = await response.json(); // Assumindo que a API retorna uma lista de livros
        const list = document.getElementById('lista-livros');
        list.innerHTML = '';

        livros.forEach(livro => {
            const item = document.createElement('div');
            item.innerHTML = `
                <h3>${livro.livro}</h3>
                <p>Autor: ${livro.autor}</p>
                <p>Páginas: ${livro.paginas}</p>
                <p>Resumo: ${livro.resumo}</p>
                <img src="${livro.photo}" alt="Capa do Livro" style="max-width: 100%; height: auto;">
            `;
            list.appendChild(item);
        });
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
    }
}

fetchLivros(); // Carrega a lista de livros ao abrir a página
