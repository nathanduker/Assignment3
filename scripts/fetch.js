// Specify the API endpoint for user data
const pokemonNames = [
    "Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard",
    "Squirtle", "Wartortle", "Blastoise", "Caterpie", "Metapod", "Butterfree",
    "Weedle", "Kakuna", "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot",
    "Rattata", "Raticate", "Spearow", "Fearow", "Ekans", "Arbok",
    "Pikachu", "Raichu", "Sandshrew", "Sandslash", "Nidoran♀", "Nidorina",
    "Nidoqueen", "Nidoran♂", "Nidorino", "Nidoking", "Clefairy", "Clefable",
    "Vulpix", "Ninetales", "Jigglypuff", "Wigglytuff", "Zubat", "Golbat",
    "Oddish", "Gloom", "Vileplume", "Paras", "Parasect", "Venonat",
    "Venomoth", "Diglett", "Dugtrio", "Meowth", "Persian", "Psyduck",
    "Golduck", "Mankey", "Primeape", "Growlithe", "Arcanine", "Poliwag",
    "Poliwhirl", "Poliwrath", "Abra", "Kadabra", "Alakazam", "Machop",
    "Machoke", "Machamp", "Bellsprout", "Weepinbell", "Victreebel", "Tentacool",
    "Tentacruel", "Geodude", "Graveler", "Golem", "Ponyta", "Rapidash",
    "Slowpoke", "Slowbro", "Magnemite", "Magneton", "Farfetch'd", "Doduo",
    "Dodrio", "Seel", "Dewgong", "Grimer", "Muk", "Shellder",
    "Cloyster", "Gastly", "Haunter", "Gengar", "Onix", "Drowzee",
    "Hypno", "Krabby", "Kingler", "Voltorb", "Electrode", "Exeggcute",
    "Exeggutor", "Cubone", "Marowak", "Hitmonlee", "Hitmonchan", "Lickitung",
    "Koffing", "Weezing", "Rhyhorn", "Rhydon", "Chansey", "Tangela",
    "Kangaskhan", "Horsea", "Seadra", "Goldeen", "Seaking", "Staryu",
    "Starmie", "Mr. Mime", "Scyther", "Jynx", "Electabuzz", "Magmar",
    "Pinsir", "Tauros", "Magikarp", "Gyarados", "Lapras", "Ditto",
    "Eevee", "Vaporeon", "Jolteon", "Flareon", "Porygon", "Omanyte",
    "Omastar", "Kabuto", "Kabutops", "Aerodactyl", "Snorlax", "Articuno",
    "Zapdos", "Moltres", "Dratini", "Dragonair", "Dragonite", "Mewtwo",
    "Mew"
];

let isSpeaking = false;
const dataContainer = document.getElementById('datacontainer');
const lowercasePokemonNames = pokemonNames.map(name => name.toLowerCase());
const pkListNumber = pokemonNames.length; //Number of pokemon found in the array
let pkRandNumber = 0;
let apiUrl = 'https://pokeapi.co/api/v2/pokemon/'+lowercasePokemonNames[pkRandNumber]+'/';

const submitButton = document.getElementById('change');
let pkName;
let pkID;
let pkType1;
let pkType2;
let speech;
let moreTypes = false;

// Make a GET request using the Fetch API

function genPk(){
  randomizePk();
  fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(pkData => {
    // Process the retrieved user data
    const audioPlayer = document.getElementById('audioPlayer');
    const audioSource = document.getElementById('audioSource');
    //playAudio(pkData.cries.latest);
    const pkNameText = document.getElementById('pkNameText');
    const pkPic = document.getElementById('pkPic');
    console.log('Pokemon Data:', pkData);
    pkName = pkData.species.name.toUpperCase();

    if (pkData.types.length >1){
      moreTypes = true;
      pkType1 = pkData.types[0].type.name;
      pkType2 = pkData.types[1].type.name;
      
    }

    else{
      moreTypes = false;
      pkType1 = pkData.types[0].type.name;
    }

    
    pkPic.src = pkData.sprites.front_default;
    const pkUrl = pkData.species.url;
    getXData(pkUrl);
    //////////////////////////////////////////////////

    //////////////////////////////////////////////////
    //console.log(pkData.sprites.front_default)
    //console.log('Pokemon Names Length: ' + pokemonNames.length);
    console.log('Pokemon Name: ' + pkName);
    pkNameText.innerHTML = `<p>${pkName}</p>`

  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function randomizePk(){
  pkRandNumber = Math.floor(Math.random() * 152);
  console.log('Pokemon Random Number: ' + pkRandNumber );
  apiUrl = 'https://pokeapi.co/api/v2/pokemon/'+lowercasePokemonNames[pkRandNumber]+'/';
}

function playAudio(url) {
  audioSource.src = url;
  audioPlayer.load(); // Reload the audio element with the new source
  audioPlayer.play();
}
function getSoundData(){

  
}
function getXData(pkUrl){

  fetch(pkUrl)
  .then(response =>{
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  }).then(xData =>{

    const apiText = xData.flavor_text_entries[0].flavor_text;
    const flavorText = removeNewLines(apiText);
    const pkDescText = document.getElementById("pkDescText");
    console.log(xData.flavor_text_entries)
    
    speech = new p5.Speech(voiceReady); // speech synthesis object
  speech.started();

    speech.cancel();
    speech.setPitch(0.85)

    if(moreTypes == false){
      speech.speak(pkName + '........' + "A " + pkType1 + " type Pokémon. " + flavorText);
    }

    else{
      speech.speak(pkName + '........' + "A " + pkType1 + "and " + pkType2 + "type Pokémon. " + flavorText);
    }
    
    console.log(flavorText);
    pkDescText.innerHTML = flavorText;
    //console.log(flavorText);
    //remove_linebreaks_ss(apiText);

  })
  .catch(error => {
    console.log('Error:', error)
  })


}



function removeNewLines(text) {
  if (typeof text !== 'string') {
    return text; // Return the original input if it's not a string
}
return text.replace(/[\n\f]/g, ' ');
}

function remove_linebreaks_ss(str) {
  console.log(typeof str);
  let newstr = "";
   
  // Looop and traverse string
  for (let i = 0; i < str.length; i++)
      if (!(str[i] == "\n" || str[i] == "\r"))
          newstr += str[i];
  console.log("new string : "+newstr);
}
function voiceReady() {
  console.log('Voices: ', speech.voices);
}