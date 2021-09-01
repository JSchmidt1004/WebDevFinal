const canvas = document.getElementById("bargraph");
const ctx = canvas.getContext("2d");

let url = "http://localhost:3000/api";

canvas.width = 800;
canvas.height = 600;

let startPoint = 0;
let index = 0;

const graphSetup = () =>
{
    //Outlining the canvas because the colors aren't working
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    //Showing the numbers
    let lineHeight = 0;
    for(let i = (canvas.height / 50); i > 0; i--)
    {
        ctx.fillText(i - 1, 5, lineHeight, 20);

        //Lines for cleanliness
        ctx.beginPath();
        ctx.moveTo(20, lineHeight);
        ctx.lineTo(canvas.width, lineHeight);
        ctx.stroke();

        if (i == 1) startPoint = lineHeight;
        lineHeight += 50;
    }
}

const fillGraph = questionData =>
{
    questionData.question;
    ctx.fillStyle = "#111";
    ctx.fillText(questionData.question, (canvas.width / 2) - 50, 25, 250);

    let options = [questionData.option1, questionData.option2, questionData.option3, questionData.option4];
    let counts = [questionData.option1Count, questionData.option2Count, questionData.option3Count, questionData.option4Count];

    let x = 100;
    let y = 0;
    let width = 125;
    let height = 0;
    let distanceBetween = 75;

    for(let i = 0; i < 4; i++)
    {
        ctx.fillText(options[i], x - 10, canvas.height - 15, width);

        let currentCount = 50 * counts[i];
        ctx.fillRect(x - (width / 2), startPoint - currentCount, width, currentCount);

        x += width + distanceBetween;
    }
}

const main = data =>
{
    ctx.font = "25px Arial";
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    graphSetup();
    fillGraph(data[index % data.length]);
};


const loop = () =>
{
    fetch(url)
    .then(response => response.json())
    .then(data => 
        {
            main(data);
        });

    index++;
}

loop();

setInterval(loop, 15000);