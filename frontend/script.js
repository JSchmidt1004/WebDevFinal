const canvas = document.getElementById("bargraph");
const ctx = canvas.getContext("2d");

let url = "http://localhost:3000/api";

canvas.width = 800;
canvas.height = 600;

const graphSetup = () =>
{
    //Outlining the canvas because the colors aren't working
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    //Showing the numbers
    let lineHeight = 0;
    for(let i = (canvas.height / 50) - 1; i > 0; i--)
    {
        ctx.fillText(i, 5, lineHeight, 20);

        //Lines for cleanliness
        ctx.beginPath();
        ctx.moveTo(20, lineHeight);
        ctx.lineTo(canvas.width, lineHeight);
        ctx.stroke();

        lineHeight += 50;
    }
}

const main = data =>
{
    console.log(data);
    graphSetup();

    let question1 = data[1];
    console.log(question1.question);
};

fetch(url)
    .then(response => response.json())
    .then(data => 
        {
            main(data);
        });
