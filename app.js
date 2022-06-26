Pixel_Size = 10;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var simulate;
const cells = new Array(500).fill("").map(()=>new Array(500).fill(false))
grid();

function grid (){
    for (var i=0;i<500;i+=10){
    ctx.beginPath();
    ctx.moveTo(i,0);
    ctx.lineTo(i,500); 
    ctx.moveTo(0,i);
    ctx.lineTo(500,i);
    ctx.strokeStyle="black";
    ctx.stroke();
    }
}

class CelularAutomata{
    constructor(size,ctx,cells){
        this.size = size;
        this.ctx = ctx;
        this.cells = [] ? cells:[];
    }
    
    create(){
        for(let x=0; x<this.size;x+=1){
            let row = [];
            for(let y=0; y<this.size;y+=1){
                const alive = Math.random()<0.5;
                row.push(alive);
            }

            this.cells.push(row);
        }
    }
    next (){
        this.print();
        this.evaluate();
    }

    print(){
        this.ctx.clearRect(0,0,this.size,this.size);
        for(let x=0;x<this.size;x+=Pixel_Size){
            for(let y=0;y<this.size;y+=Pixel_Size){
                if (this.cells[x][y])
                    this.ctx.fillStyle="black";
                else
                    this.ctx.fillStyle="white";

                this.ctx.fillRect(x,y,Pixel_Size,Pixel_Size)
            }            
        }
    }

    evaluate(){
        
        let cellsAux = new Array(500).fill("").map(()=>new Array(500).fill(false))

        for(let x=0;x<this.size;x+=Pixel_Size){
            for(let y=0;y<this.size;y+=Pixel_Size){
                let LiveNeigh = 0;
                if (x>0 && y>0)
                if (this.cells[x-Pixel_Size][y-Pixel_Size])
                    LiveNeigh++;
                
                if (y>0)
                if (this.cells[x][y-Pixel_Size])
                    LiveNeigh++;

                if (x<(this.size-Pixel_Size) && y>0)
                if (this.cells[x+Pixel_Size][y-Pixel_Size])
                    LiveNeigh++;
                
                if (x>0)
                if (this.cells[x-Pixel_Size][y])
                    LiveNeigh++;

                if (x<(this.size-Pixel_Size))
                if (this.cells[x+Pixel_Size][y])
                    LiveNeigh++;

                if (x>0 && y<(this.size-Pixel_Size))
                if (this.cells[x-Pixel_Size][y+Pixel_Size])
                    LiveNeigh++; 

                if (y<(this.size-Pixel_Size))
                if (this.cells[x][y+Pixel_Size])
                    LiveNeigh++;

                if (x<(this.size-Pixel_Size) && y<(this.size-Pixel_Size))
                if (this.cells[x+Pixel_Size][y+Pixel_Size])
                    LiveNeigh++;     

                if (this.cells[x][y])
                    cellsAux[x][y]= LiveNeigh == 2 || LiveNeigh == 3 ? true : false;
                else
                    cellsAux[x][y]= LiveNeigh == 3 ? true : false;     
            }            
        }
        
        this.cells = cellsAux;
    }
}


var celularAutomata = new CelularAutomata(500,ctx,cells);



function drawPixel(x,y){
    ctx.fillStyle="black";
    cells[x*Pixel_Size][y*Pixel_Size] = true;
    ctx.fillRect(
        x * Pixel_Size,
        y * Pixel_Size,
        Pixel_Size,
        Pixel_Size   
    );
}

canvas.onmousedown = function (e) {
    canvas.onmousedown = motion;
    motion(e); 
}

canvas.onmouseup = function(e) {
    canvas.onmouseup = null;
}

function Clearcanvas (){
    clearInterval(simulate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let x=0;x<500;x++){
        for(let y=0;y<500;y++){
            cells[x][y] = false;          
        }
    }
    celularAutomata = new CelularAutomata(500,ctx,cells);
    grid();
    canvas.onmousedown = function (e){
        canvas.onmousedown = motion;
        motion(e); 
    }
}

function motion (e) {
    drawPixel(
        Math.floor((e.clientX - canvas.offsetLeft) / Pixel_Size),
        Math.floor((e.clientY - canvas.offsetTop) / Pixel_Size),
    );
   
}

function Simulate(){
    celularAutomata.create();
    simulate = setInterval(()=>celularAutomata.next(),80);
    canvas.onmousedown = false;
}


