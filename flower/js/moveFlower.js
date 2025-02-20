var isMoving = false;
let animationId;

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("flowerCanvas");
    const ctx = canvas.getContext("2d");
    const maxMovementRadius = Math.min(canvas.width, canvas.height) / 5; // Keep inside bounds

    let angle = 0; // Angle for circular motion
    let radius = maxMovementRadius; // Radius of movement path
    const speed = 0.05; // Speed of movement
    const centerX = canvas.width/2;
    const centerY = canvas.height/2;

    document.getElementById("changeAnimation").addEventListener("click", () => {

        //the flower is already moving
        if (isMoving){
            document.querySelector('#changeAnimation').innerText = "Move Flower"
            isMoving = false;
            cancelAnimationFrame(animationId);
        }
        else{
            document.querySelector('#changeAnimation').innerText = "Stop Flower"
            isMoving = true;
            animateFlower(); // Start the animation when button is clicked
        }
        
    });

    function animateFlower() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous frame

        // Compute new position
        let offsetX = Math.cos(angle) * radius;
        let offsetY = Math.sin(angle) * radius;

        // Call the drawing function with new position
        drawFlowerAt(centerX + offsetX, centerY + offsetY);

        angle += speed; // Increment angle for smooth movement
        animationId = requestAnimationFrame(animateFlower); // Loop animation
        console.log("Canvas Size:", canvas.width, canvas.height);

    }

    function drawFlowerAt(x, y) {
        const petalCount = 7;
        const petalLength = 80;
        const petalWidth = 60;
        const centerRadius = 20;

        for (let i = 0; i < petalCount; i++) {
            const petalAngle = (i * Math.PI * 2) / petalCount;
            const petalTipX = x + Math.cos(petalAngle) * petalLength;
            const petalTipY = y + Math.sin(petalAngle) * petalLength;

            const controlX1 = x + Math.cos(petalAngle - 0.5) * petalWidth;
            const controlY1 = y + Math.sin(petalAngle - 0.5) * petalWidth;
            const controlX2 = x + Math.cos(petalAngle + 0.5) * petalWidth;
            const controlY2 = y + Math.sin(petalAngle + 0.5) * petalWidth;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.quadraticCurveTo(controlX1, controlY1, petalTipX, petalTipY);
            ctx.quadraticCurveTo(controlX2, controlY2, x, y);
            ctx.fillStyle = currentPetalColor;
            ctx.fill();
            ctx.stroke();
        }

        // Draw center of the flower
        ctx.beginPath();
        ctx.arc(x, y, centerRadius, 0, Math.PI * 2);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.stroke();
    }
});

