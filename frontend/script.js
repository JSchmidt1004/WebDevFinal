const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let url = "http://localhost:3000/api";

const main = data =>
{
    console.log(data);
};

fetch(url)
    .then(response => response.json())
    .then(data => 
        {
            main(data);
        });