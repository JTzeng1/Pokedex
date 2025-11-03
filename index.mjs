import express from 'express';
import fetch from 'node-fetch';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));



app.get('/', async (req, res) => {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000');
    let data = await response.json();
    let pokemons = data.results.sort((firstPokemon, secondPokemon) => {

        if (firstPokemon.name > secondPokemon.name) 
            return 1;   
        if (firstPokemon.name < secondPokemon.name) 
            return -1; 
        return 0; 
    });
    res.render('home.ejs', { pokemons });
});



app.get('/pokemonInfo', async (req, res) => {
    let name = req.query.name?.toLowerCase();
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    let pokemon = await response.json();

    res.render('pokemonDisplay.ejs', { pokemon });
});


app.get('/library', async (req, res) => {
    let response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000');
    let data = await response.json();

    let pokemons = [];

    for (let i = 0; i < data.results.length; i++) {
        let pokemon = data.results[i];
        let pokeResponse = await fetch(pokemon.url);
        let pokeData = await pokeResponse.json();

        if (pokeData.sprites.front_default) {
            pokemons.push({
                name: pokemon.name,
                image: pokeData.sprites.front_default
            });
        }
    }
    pokemons.sort((firstPokemon, secondPokemon) => {
        if (firstPokemon.name > secondPokemon.name) 
            return 1;
        if (firstPokemon.name < secondPokemon.name) 
            return -1;
        return 0;
    });
    res.render('library.ejs', { pokemons });
});

app.get('/about', (req, res) => {
    res.render('about.ejs');
});

app.get("/dbTest", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});


app.listen(3000, () => {
    console.log("Express server running on port 3000");
});
