#!/usr/bin/env node
'use strict';
var readline = require('readline-sync');

var primapuntata;
var fine; 
var reg_A, reg_M, reg_R, reg_B1, reg_B2, reg_C1, reg_C2, reg_D1, reg, temp;
var avvx, m101x, puntx;
var isPuntataValida;

function InizioGioco() {
    primapuntata = 0;
    fine = 0;
    reg_A = 0;
    reg_M = 0;
    reg_R = 0;
    reg_B1 = 0;
    reg_B2 = 0;
    reg_C1 = 0;
    reg_C2 = 0;
    reg_D1 = 0;
    reg = 0;
    temp = 0;
    avvx = 0; 
    m101x = 0;
    puntx = 0;
    isPuntataValida = true;
}

function checkMeta(x) {
    if ((x == 0) || (x == null)) {
           console.log("IL GIOCO E' STATO INTERROTTO\nPremere il pulsante Restart Game per ricominciare.");
           fine = 1;
           return false;
    }
    if ((x < 30) || (x > 100) || isNaN(x)) {
           console.log("META NON VALIDA\nIntrodurre un valore tra 30 e 100.");
           return false;
    } 
    return true;
}

function setMeta() {
    var x = parseInt(readline.question('Inserisci la meta: '));

    if ((checkMeta(x) == true) && (fine != 1)) {
        reg_M = x;
        Trasf("B1");
        //cancella Totale
        Azzera("B2");
        //ultima puntata della P101 = meta (> 6) serve per avere
        //prima puntata di A <> puntata prec P anche se prima puntata di A è vuota
        Trasf("C1");
    
        primapuntata = 1;         
    }
}

function setPuntata(valore) {
    var controllo = controllaPuntata(valore);
    if (controllo != 0) {
        reg_M = parseInt(valore);
        primapuntata = 0;
        RV2();
	    aggiungi_riga_punteggi();
        if (fine == 0) {
            controllo_fine_gioco_P();
        }
    }
}

function controllaPuntata(valore) {
    if (primapuntata == 0 && valore == null) {
        return 1;
    }
        
    if (((valore < 0) || (valore > 6)) && (primapuntata == 1)) {
        console.log("ANGELA GAME\nPUNTATA NON VALIDA\nReimpostare la puntata.");
        return 0;
    }
    if (((valore < 1) || (valore > 6)) && primapuntata == 0) {
        console.log("ANGELA GAME\nPUNTATA NON VALIDA\nReimpostare la puntata.");
        return 0;
    }

    return 1;
}

function aggiungi_riga_punteggi() {    
    if (isPuntataValida == true) {
        console.log("avversario = " + avvx + ", p101 = " + m101x + ", punteggio = " + puntx);
        avvx = "-";
        m101x= "-";
    } else {
        isPuntataValida = true;
        avvx = "-";
        m101x= "-";
    }
}

//EMULAZIONE

function Somma(val) {
    riga_col_E(val);
    reg_M = reg;
    reg_A = reg_A + reg_M;
}

function Sottr(val) {
    riga_col_E(val);
    reg_M = reg;
    reg_A = reg_A - reg_M;
}

function Molt(val) {
    riga_col_E(val);
    reg_M = reg;
    reg_A = reg_A * reg_M;
}

function Div(val) {
    temp = reg_A;
    //quoziente
    riga_col_E(val);
    reg_M = reg;
    reg_A = reg_A / reg_M;
    //resto
    reg_R = temp % reg_M;
}

function Trasf(val) {
    reg = reg_M;
    riga_col_U(val);
}

function Rich(val) {
    riga_col_E(val);
    reg_A = reg;
}

function Scambio(val) {
    temp = reg_A;
    //richiama registro in A
    riga_col_E(val);   
    reg_A = reg;
    //trasferisci temp in registro
    reg = temp;
    riga_col_U(val);
}

function Val_ass(val) {
    reg_A = Math.abs(reg_A);
}

function Const_progr(val) {
    reg_M = val;
}

function Azzera(val) {
    reg = 0;
    riga_col_U(val);
}

function riga_col_U(val) {
    if (val == "A") {
        reg_A = reg;
    } else if (val == "M") {
        reg_M = reg;
    } else if (val == "R") {
        reg_R = reg;
    } else if (val == "B1"){
        reg_B1 = reg;
    } else if (val == "B2") {
        reg_B2 = reg;
    } else if (val == "C1") {
        reg_C1 = reg;
    } else if (val == "C2") {
        reg_C2 = reg;
    } else if (val == "D1") {
        reg_D1 = reg;
    }
}

function riga_col_E(val) {
    if (val == "A") {
        reg = reg_A;
    } else if (val == "M") {
        reg = reg_M;
    } else if (val == "R") {
        reg = reg_R;
    } else if (val == "B1") {
        reg = reg_B1;
    } else if (val == "B2") {
        reg = reg_B2;
    } else if (val == "C1") {
        reg = reg_C1;
    } else if (val == "C2") {
        reg = reg_C2;
    } else if (val == "D1") {
        reg = reg_D1;
    }
}

// SIMULAZIONE GOTO

function RV2() {
    Trasf("D1");
    avvx = reg_D1;
    Azzera("C2");
    RY1();
}

function RV3() {
    //TOTALIZZA PUNTATA A
    Rich("B2");
    Somma("D1");
    Scambio("B2");
    //stampa totale A
    puntx = reg_B2;
    //controllo fine gioco A      (interlinea addizionale ?)
    controllo_fine_gioco_A();
    if (fine == 1)
        return;
    //PUNTATA P (Differenza modulo 9  Memorizza I prima e II scelta)
    //differenza
    Rich("B1");
    Sottr("B2");
    Const_progr(9);
    //modulo 9
    Div("M");
    Scambio("R");
    if (reg_A <= 0) {
        //somma 9 a Differenza se diff <=0
        Somma("M");
    }
    RV4();
}

function RV4() {
    //Memorizza I prima e II scelta
    //1 in A Diff in M
    Div("A");
    //Memorizza Diff come prima scelta
    Trasf("C1");
    //reg Memorizza Diff + 1 come seconda scelta
    Somma("M");
    Scambio("C2");
    //MODIFICA I VALORI DI PRIMA E SECONDA SCELTA
    //D=3
    Rich("C1");
    Const_progr(3);
    Sottr("M");
    Val_ass(0);
    //se <> 3 prova 6
    if (reg_A <= 0) {
        //se = 3
        //prima scelta inalterata
        //seconda scelta = 5
        Const_progr(5);
        Trasf("C2");
        RY1();
        return;
    }
    RW1();
}

function RW1() {
    //D=6
    //sottrai 3 (-3 -3= -6)
    Sottr("M");
    //se > 6
    if (reg_A > 0) {
        RW2();
        return;
    }
    Val_ass(0);
    //se < 6 controlla puntata
    if (reg_A > 0) {
        RY1();
        return;
    }
    //se = 6
    //prima scelta inalterata
    //seconda scelta = 3
    Trasf("C2");
    RY1();
}

function RW2() {
    //D=7
    Const_progr(1);
    Sottr("M");
    if (reg_A > 0) {
        RW3();
        return;
    }
    //seconda scelta = 1
    Trasf("C2");
    //prima scelta = 3
    Const_progr(3);
    Trasf("C1");
    RY1();
}

function RW3() {
    //D=8
    Sottr("M");
    if (reg_A > 0) {
        RW4();
        return;
    }
    //seconda scelta = 1
    Trasf("C2");
    //prima scelta = 4
    Const_progr(4);
    Trasf("C1");
    RY1();
}

function RW4() {
    //D=9
    Sottr("M");
    //(sicuramente = 9)
    //prima scelta =1
    Trasf("C1");
    //seconda scelta = 2
    Somma("M");
    Somma("M");
    Scambio("C2");
    RY1();
}

function RY1() {
    //CONTROLLA PUNTATA A o P
    //|A-P|
    Rich("D1");
    Sottr("C1");
    Val_ass(0);
    //se A <> P controlla complemento
    if (reg_A > 0) {
        RY2();
        return;
    }
    RY3();
}

function RY2() {
    //|Compl A - P|
    Const_progr(7);
    Rich("M");
    Sottr("D1");
    Sottr("C1");
    Val_ass(0);
    //se Compl A <> P verifica Dev A - P
    if (reg_A > 0) {
        RZ1();
    } else {
        RY3();
    }
}

function RY3() {
    //BLOCCA PUNTATA A  o  DEFINISCE I-II SCELTA  (Primo sondaggio Dev A - P)
    //Dev A - P
    Rich("C2");
    //se Dev |A - P| = P esegui seconda scelta
    if (reg_A > 0) {
        RY4();
        return;
    }
    //se Dev |A - P| = A segnala Puntata A non Valida
    console.log("NON BARARE\nReimpostare la puntata.");
    isPuntataValida = false;
}

function RY4() {
    //seconda scelta in C1
    Scambio("C1");
    RZ1();
}

function RZ1() {
    //COMPLETA PUNTATA A  o  VERIFICA DIFF=2     (Secondo sondaggio Dev A - P)
    //Dev A - P
    Rich("C2");
    //se puntata di P verifica Diff Meta - Totale
    if (reg_A > 0) {
        RZ2();
    } else {
        //se puntata di A vai a Totalizza A
        RV3();
    }
}

function RZ2() {
    //verifica Diff  = Meta - Totale
    Rich("B1");
    Sottr("B2");
    Const_progr(2);
    Sottr("M");
    //se diff > 2 vai a Stampa
    if (reg_A > 0) {
        RZ3();
        return;
    }
    //se = 2 verifica se A=2
    Rich("D1");
    Sottr("M");
    Val_ass(0);
    if (reg_A > 0) {
        RZ3();
        return;
    }
    //se A =2
    Const_progr(1);
    Trasf("C1");
    RZ3();
}

function RZ3() {
    //STAMPA P E TOTALE
    //stampa P
    m101x = reg_C1;
    //somma P a Totale
    Rich("B2");
    Somma("C1");
    Scambio("B2");
    //stampa Totale Interlinea
    puntx = reg_B2;
}

function controllo_fine_gioco_A() {
    Rich("B1");
    Sottr("B2");
    if (reg_A == 0) {
        console.log(" HAI VINTO\nPremere Restart Game per ricominciare a giocare.");
        fine = 1;
        return;
    } else if (reg_A < 0) {
    console.log("HAI PERSO\nPremere Restart Game per ricominciare a giocare.");
        fine = 1;
        return;
    }
}

function controllo_fine_gioco_P() {
    fine = 0;
    Rich("B1");
    Sottr("B2");
    if (reg_A == 0) {
        console.log("HAI PERSO\nPremere Restart Game per ricominciare a giocare.");
        fine = 1;
    } else if (reg_A < 0) {
        console.log("HAI VINTO\nPremere Restart Game per ricominciare a giocare.");
        fine = 1;
    }
}

function Gioca() {
    InizioGioco();
    setMeta();

    while (fine == 0) {
        var x = parseInt(readline.question('Inserisci la puntata: '));
        setPuntata(x);
    }
}

Gioca();
