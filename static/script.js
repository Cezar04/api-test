let firstPageAPi = 'https://swapi.dev/api/planets/?page=1'; 
let prevPageAPI;
let nextPageAPI;
let previousButton = document.querySelector("#previous");
let nextButton = document.querySelector("#next");
let total_Nr_Of_Pages_For_Resindents_Fetch = 0;
let allResidents = [];

let popUp = document.querySelector('.modal-container');
let close = document.getElementById('close');

close.addEventListener('click', function(){
    popUp.style.display = 'none';
})

document.body.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
        popUp.style.display = "none";
        console.log(e);
    }
});
/* "async" method tells javascript that this function will be asynchronous => Async operations are put into an event queue, 
which runs after the main thread has finished processing so that they do not block subsequent JavaScript code from running */
async function getPlanets(page){ 

    //request data from API and wait for it (use "await" method with "async")
    let request = await fetch(page);
    let data = await request.json();


    //get previous page API (can be null or not) and store in the global variable, it will be used in another function
    prevPageAPI = data.previous;

    //get next page API (can be null or not) and store in the global variable, it will be used in another function
    nextPageAPI = data.next;
 

/* you can call functions before you write them because of javascript hoisting => mechanism where variables and function declarations are moved 
to the top of their scope before code execution */
    
    //call the display function to render the table in the HTML with the data returned by the fetch
    console.log(data);
    displayPlanets(data.results);

}



function displayPlanets(planets){
    let tableBody = document.querySelector("#planets");

    //reset tablebody HTML to empty (if you dont do this each time you call the function displayPlanets it will add data to the table)
    tableBody.innerHTML = "";

    //iterate through each planet and its info
    for(planet of planets){

        //check if there are residents or not and store the info
        let residents = 'No known residents';
        if (planet.residents.length > 0){
            residents = `<button  onclick="showResindents('${planet.url}')" class=residents id="open" type=button>${planet.residents.length}</button>`;
        };
       
       
    
        //check if diameter is known or not and store the info
        let diameter = "unknown";
        if(planet.diameter !== "unknown"){
            diameter = new Intl.NumberFormat().format(parseInt(planet.diameter)) + " km";
        };

        //check if surface water is known or not and store the info
        let surfaceWater = "unknown";
        if(planet.surface_water !== "unknown"){
            surfaceWater = planet.surface_water + "%";
        };
      
        //check if population is known or not and store the info
        let population = "unknown";
        if(planet.population !== "unknown"){
            population = new Intl.NumberFormat().format(parseInt(planet.population));
        };

        //add rows to tableBody as they are generated by the iteration(for)
        tableBody.innerHTML += `
        <tr>
            <td>${planet.name}</td>
            <td>${diameter}</td>
            <td>${planet.climate}</td>
            <td>${planet.terrain}</td>   
            <td>${surfaceWater}</td>  
            <td>${population}</td> 
            <td>${residents}</td>      
        </tr>`;

    }
}




function nextPageOnClick(){
    //if next page API is not null call getPlanets function with the new API
    if(nextPageAPI !== null){
        getPlanets(nextPageAPI);
    }
}


function previousPageOnClick(){
    //if previous page API is not null call getPlanets function with the previous API
    if(prevPageAPI !== null){
        getPlanets(prevPageAPI);
    }
}


async function getOnePageResidents(URL){
    let request = await fetch(URL);
    let data = await request.json();
    
    for(residents of data.results){
        allResidents.push(residents);
    }
    
}


async function getAllResidentsData(){
    let request = await fetch("https://swapi.dev/api/people/?page=1");
    let data = await request.json();

    let total_Number_Of_Residents = Number(data.count);
    let resultsPerPage = Number(data.results.length);
    
    total_Nr_Of_Pages_For_Resindents_Fetch = Math.ceil(total_Number_Of_Residents / resultsPerPage);

    let incompleteURL = "https://swapi.dev/api/people/?page=";
    for(let i=1; i<=total_Nr_Of_Pages_For_Resindents_Fetch; i++){
        let completeURL = incompleteURL + `${i}`;
         getOnePageResidents(completeURL);
     }

}


function showResindents(planetURL){
    let tableBody = document.querySelector("#residents");
    tableBody.innerHTML = "";
    popUp.style.display = "block";
    for (resident of allResidents){
        if(resident.homeworld === planetURL){
            tableBody.innerHTML += `
            <tr>
                <td>${resident.name}</td>
                <td>${resident.height}</td>
                <td>${resident.mass}</td>
                <td>${resident.skin_color}</td>
                <td>${resident.hair_color}</td>
                <td>${resident.eye_color}</td>
                <td>${resident.birth_year}</td>
                <td>${resident.gender}</td>
            </tr>`;
        }
    }
}



nextButton.addEventListener('click', nextPageOnClick);
previousButton.addEventListener('click', previousPageOnClick);



getPlanets(firstPageAPi);
getAllResidentsData();

// async function getData(){
//     const response = await fetch(api_url);
//     const data = await response.json();
//     const{results, next, previous} = data;
//     let temp = '';
//     results.forEach(element => {
//         temp += '<tr>';
//         temp += '<td>'+element.name+'</td>';
//         temp += '<td>'+new Intl.NumberFormat().format(parseInt(element.diameter))+' km'+'</td>';
//         temp += '<td>'+element.climate+'</td>';
//         temp += '<td>'+element.terrain+'</td>';
//         if(element.surface_water==='unknown'){
//             temp += '<td>'+element.surface_water+'</td>';
//         }else{
//             temp += '<td>'+element.surface_water+'%'+'</td>';
//         }
//         if(element.population!=='unknown'){
//             temp += '<td>'+new Intl.NumberFormat().format(parseInt(element.population))+'</td>'; 
//         }else{
//             temp += '<td>'+'unknown'+'</td>';
//         }
//         if(element.residents.length>0){
//             temp += '<td>'+`<button class='residents'  type='button'>${element.residents.length}</button>`+'</td></tr>';
//         }else{
//             temp += '<td>'+'No known residents'+'</td></tr>';
//         } 

//     })
//     document.getElementById("results").innerHTML = temp;
    
//     let popUp = document.querySelectorAll('.residents');
//     popUp.forEach(element =>{
//       element.addEventListener('click', ceva);
//     });
   
// };

// getData();


// console.log(results);

// let previousPage = document.getElementById('previous');
// let nextPage = document.getElementById('next');


// nextPage.addEventListener('click', ceva);
// previousPage.addEventListener('click', ceva);


// function ceva() {
//     console.log("hello");
// }