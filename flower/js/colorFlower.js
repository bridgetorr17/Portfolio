var currentPetalColor;

function drawFlower(petalColor) {

    currentPetalColor = petalColor;

    const canvas = document.getElementById("flowerCanvas");
    canvas.height = canvas.width * 1.5
    const ctx = canvas.getContext("2d");

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const petalCount = 7;
    const petalLength = 80;
    const petalWidth = 60;
    const centerRadius = 20;

    for (let i = 0; i < petalCount; i++) {
        const angle = (i * Math.PI * 2) / petalCount;
        const petalTipX = centerX + Math.cos(angle) * petalLength;
        const petalTipY = centerY + Math.sin(angle) * petalLength;

        const controlX1 = centerX + Math.cos(angle - 0.5) * petalWidth;
        const controlY1 = centerY + Math.sin(angle - 0.5) * petalWidth;
        const controlX2 = centerX + Math.cos(angle + 0.5) * petalWidth;
        const controlY2 = centerY + Math.sin(angle + 0.5) * petalWidth;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.quadraticCurveTo(controlX1, controlY1, petalTipX, petalTipY);
        ctx.quadraticCurveTo(controlX2, controlY2, centerX, centerY);
        ctx.fillStyle = petalColor;
        ctx.fill();
        ctx.stroke();
    }

    // Draw center of the flower
    ctx.beginPath();
    ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.stroke();
    console.log("Canvas Size:", canvas.width, canvas.height);
}

document.getElementById("colorFlowerSelector").addEventListener("change", function(event){
    drawFlower(event.target.value)
})


