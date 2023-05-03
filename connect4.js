window.addEventListener('load', function() {

    const spieldfeld = document.getElementById('spielfeld');
    const resetknopf = document.getElementById('resetknopf');

    const indexspieler = ["leer", "Dunkelgrün", "Hellgrün"]
    const feldklassen = ["feldleer", "feldeins", "feldzwei"];
    const log = []
   
    document.getElementById("zurBild").addEventListener('click', zurBild);


//Zusatz !!!!
    let spieler = 1;   // Wer ist dran?
    this.document.getElementById("logo").onclick = function(){
        window.location.href = "https://jamil-content.pages.dev/";
    }
    this.document.getElementById("name").onclick = function(){
        window.location.href = "https://jamil-content.pages.dev/";
    }

    
    const pushDiv = function(spalte, zeile){
        log.push([spalte, zeile]);
        console.log(log);
        
    }

    function zurBild(){
        if (log.length > 0) {
             let [spalte, zeile] = log.pop();
            setWert(getDiv(spalte, zeile), 0);
            spieler = 3 - spieler;
            document.getElementById("zug").innerHTML = indexspieler[spieler] + " ist am Zug";
            
        }
    }

    const getWert = function(div) {
        return Number(div.attributes.wert.value);
    }

    const setWert = function(div, wert) {
        div.setAttribute('wert', wert);
        div.className = feldklassen[wert];
    }

    const getDiv = function(spalte, zeile) {
        return spieldfeld.children.item(spalte+7*zeile);
    }

    const feldClick = function() {
        let div = this;
        let spalte = Number(div.attributes.spalte.value);
        

        let zeile = 5; // zuunterst starten
        while (zeile>=0 && getWert(getDiv(spalte, zeile))!=0) {  // Wiederholen, so lange das Feld besetzt ist und die zeile noch nicht negativ ist
            zeile--;
        
        }
        
        if (zeile==-1) { // negative zeile? Also alles voll.
            return;  // Funktion sofort abbrechen
        }

        // Wert auf freien Platz setzen
        setWert(getDiv(spalte, zeile), spieler);
        if (pruefen(spalte, zeile)){
            window.alert(indexspieler[spieler] + " hat gewonnen");
        }
        else{
            console.log(spieler);
        }
        
        pushDiv(spalte, zeile);
        // Der andere Spieler ist jetzt an der Reihe
        spieler = 3-spieler;

        
        
        
        document.getElementById("zug").innerHTML = indexspieler[spieler] + " ist am Zug";
        
    }


    const makeFeld = function() {
        for (let zeile=0; zeile<6; zeile++) {
            for (let spalte=0; spalte<7; spalte++) {
                // Unterelement erzeugen
                let div = document.createElement('div');
                // Attribute setzen
                div.setAttribute('spalte', spalte);
                div.setAttribute('zeile', zeile);
                // Klick-Funktion definieren
                div.addEventListener('click', feldClick);
                // Klasse für die Darstellung hinzufügen
                setWert(div, 0);
                // Dem Feld hinzufügen
                spieldfeld.appendChild(div);
            }
        }
    }

    const reset = function() {
        for (let div of spieldfeld.children) {
            setWert(div, 0);
        }
        log.length=0
        spieler = 1;        // Wer ist dran?
        document.getElementById("zug").innerHTML = indexspieler[1] + " ist am Zug";
    } 

    const init = function() {
        makeFeld();
        resetknopf.addEventListener('click',reset);
        reset();
    }

    
    
    // Zugriff auf Feld etwas vereinfachen:
    function getValueAt(x,y) {
        // wenn x,y nicht auf dem Brett, 0 züruckgeben
        // sonst den Wert vom Feld x,y
        if (x > 6 || x < 0 || y > 5 || y < 0){
            return 0
        }
        else{
            return getWert(getDiv(x, y))
        }
            
    }
    
    // Gibt die Anzahl gleicher Felder an, wenn man bei (startx, starty) startet und in Richtung (dx,dy) weiter geht.
    // Ist das Startfeld schon 0, wird sofort 0 zurückgegeben
    function count(startx, starty, dx, dy) {
        let wert = getValueAt(startx,starty);             // Wert auf Startfeld
        if (wert==0) return 0;                            // Keine Nuller zählen
        let anzahl = 0;
        while (wert==getValueAt(startx,starty)) {         // Immer noch das Gleiche?
            anzahl++;
            startx+=dx;                                   // Vorwärts
            starty+=dy;
        }
        return anzahl;
    }
    
    // Liefert true, wenn die Position (startx, starty) Teil eines Vierers ist
    function pruefen(x, y) {
        let dirs = [[1,0], [1,1], [0,1], [-1,1]]; // Trigonometrisch, 45 Grad Schritte.
        for (let d of dirs) {
            let anzahl = count(x, y, d[0], d[1]) + 
                        count(x, y, -d[0], -d[1]) - 1;
            if (anzahl>=4) {
                return true;
            }
        }
        return false;
    }

    init();
});