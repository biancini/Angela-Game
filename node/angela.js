#!/usr/bin/env node
'use strict';

function AngelaGame() {
    var primapuntata;
    var fine; 
    var avvx, m101x, puntx;
    var isPuntataValida;

    var readline = require('readline-sync');
    var programma101 = new require('./programma101.js')();

    return {
        InizioGioco: function() {
            primapuntata = 0;
            fine = 0;
            avvx = 0; 
            m101x = 0;
            puntx = 0;
            isPuntataValida = true;
            programma101.init();
        },

        checkMeta: function(x) {
            if ((x == 0) || (x == null)) {
                console.log("IL GIOCO E' STATO INTERROTTO.");
                fine = 1;
                return false;
            }
            if ((x < 30) || (x > 100) || isNaN(x)) {
                console.log("META NON VALIDA - Introdurre un valore tra 30 e 100.");
                return false;
            } 
            return true;
        },

        setMeta: function() {
            var x = parseInt(readline.question('Inserisci la meta: '));

            if ((this.checkMeta(x) == true) && (fine != 1)) {
                programma101.SetRegM(x);
                programma101.Trasf("B1");
                //cancella Totale
                programma101.Azzera("B2");
                //ultima puntata della P101 = meta (> 6) serve per avere
                //prima puntata di A <> puntata prec P anche se prima puntata di A è vuota
                programma101.Trasf("C1");
            
                primapuntata = 1;         
            }
        },

        setPuntata: function(valore) {
            var controllo = this.controllaPuntata(valore);
            if (controllo != 0) {
                programma101.SetRegM(parseInt(valore));
                primapuntata = 0;
                this.RV2();
                this.aggiungi_riga_punteggi();
                if (fine == 0) {
                    this.controllo_fine_gioco_P();
                }
            }
        },

        controllaPuntata: function(valore) {
            if (primapuntata == 0 && valore == null) {
                return 1;
            }
                
            if (((valore < 0) || (valore > 6)) && (primapuntata == 1)) {
                console.log("PUNTATA NON VALIDA - Reimpostare la puntata.");
                return 0;
            }
            if (((valore < 1) || (valore > 6)) && primapuntata == 0) {
                console.log("PUNTATA NON VALIDA - Reimpostare la puntata.");
                return 0;
            }

            return 1;
        },

        aggiungi_riga_punteggi: function() {
            if (isPuntataValida == true) {
                console.log("avversario = " + avvx + ", p101 = " + m101x + ", punteggio = " + puntx);
                avvx = "-";
                m101x= "-";
            } else {
                isPuntataValida = true;
                avvx = "-";
                m101x= "-";
            }
        },

        // SIMULAZIONE GOTO

        RV2: function() {
            programma101.Trasf("D1");
            avvx = programma101.GetRegD1();
            programma101.Azzera("C2");
            this.RY1();
        },

        RV3: function() {
            //TOTALIZZA PUNTATA A
            programma101.Rich("B2");
            programma101.Somma("D1");
            programma101.Scambio("B2");
            //stampa totale A
            puntx = programma101.GetRegD1();
            //controllo fine gioco A
            this.controllo_fine_gioco_A();
            if (fine == 1)
                return;
            //PUNTATA P (Differenza modulo 9  Memorizza I prima e II scelta)
            //differenza
            programma101.Rich("B1");
            programma101.Sottr("B2");
            programma101.Const_progr(9);
            //modulo 9
            programma101.Div("M");
            programma101.Scambio("R");
            if (programma101.GetRegA() <= 0) {
                //somma 9 a Differenza se diff <=0
                programma101.Somma("M");
            }
            this.RV4();
        },

        RV4: function() {
            //Memorizza I prima e II scelta
            //1 in A Diff in M
            programma101.Div("A");
            //Memorizza Diff come prima scelta
            programma101.Trasf("C1");
            //reg Memorizza Diff + 1 come seconda scelta
            programma101.Somma("M");
            programma101.Scambio("C2");
            //MODIFICA I VALORI DI PRIMA E SECONDA SCELTA
            //D=3
            programma101.Rich("C1");
            programma101.Const_progr(3);
            programma101.Sottr("M");
            programma101.Val_ass(0);
            //se <> 3 prova 6
            if (programma101.GetRegA() <= 0) {
                //se = 3
                //prima scelta inalterata
                //seconda scelta = 5
                programma101.Const_progr(5);
                programma101.Trasf("C2");
                this.RY1();
                return;
            }
            this.RW1();
        },

        RW1: function() {
            //D=6
            //sottrai 3 (-3 -3= -6)
            programma101.Sottr("M");
            //se > 6
            if (programma101.reg_A > 0) {
                this.RW2();
                return;
            }
            programma101.Val_ass(0);
            //se < 6 controlla puntata
            if (programma101.reg_A > 0) {
                this.RY1();
                return;
            }
            //se = 6
            //prima scelta inalterata
            //seconda scelta = 3
            programma101.Trasf("C2");
            this.RY1();
        },

        RW2: function() {
            //D=7
            programma101.Const_progr(1);
            programma101.Sottr("M");
            if (programma101.GetRegA() > 0) {
                this.RW3();
                return;
            }
            //seconda scelta = 1
            programma101.Trasf("C2");
            //prima scelta = 3
            programma101.Const_progr(3);
            programma101.Trasf("C1");
            this.RY1();
        },

        RW3: function() {
            //D=8
            programma101.Sottr("M");
            if (programma101.GetRegA() > 0) {
                this.RW4();
                return;
            }
            //seconda scelta = 1
            programma101.Trasf("C2");
            //prima scelta = 4
            programma101.Const_progr(4);
            programma101.Trasf("C1");
            this.RY1();
        },

        RW4: function() {
            //D=9
            programma101.Sottr("M");
            //(sicuramente = 9)
            //prima scelta =1
            programma101.Trasf("C1");
            //seconda scelta = 2
            programma101.Somma("M");
            programma101.Somma("M");
            programma101.Scambio("C2");
            this.RY1();
        },

        RY1: function() {
            //CONTROLLA PUNTATA A o P
            //|A-P|
            programma101.Rich("D1");
            programma101.Sottr("C1");
            programma101.Val_ass(0);
            //se A <> P controlla complemento
            if (programma101.GetRegA() > 0) {
                this.RY2();
                return;
            }
            this.RY3();
        },

        RY2: function() {
            //|Compl A - P|
            programma101.Const_progr(7);
            programma101.Rich("M");
            programma101.Sottr("D1");
            programma101.Sottr("C1");
            programma101.Val_ass(0);
            //se Compl A <> P verifica Dev A - P
            if (programma101.GetRegA() > 0) {
                this.RZ1();
            } else {
                this.RY3();
            }
        },

        RY3: function() {
            //BLOCCA PUNTATA A  o  DEFINISCE I-II SCELTA  (Primo sondaggio Dev A - P)
            //Dev A - P
            programma101.Rich("C2");
            //se Dev |A - P| = P esegui seconda scelta
            if (programma101.GetRegA() > 0) {
                this.RY4();
                return;
            }
            //se Dev |A - P| = A segnala Puntata A non Valida
            console.log("NON BARARE - Reimpostare la puntata.");
            isPuntataValida = false;
        },

        RY4: function() {
            //seconda scelta in C1
            programma101.Scambio("C1");
            this.RZ1();
        },

        RZ1: function() {
            //COMPLETA PUNTATA A  o  VERIFICA DIFF=2     (Secondo sondaggio Dev A - P)
            //Dev A - P
            programma101.Rich("C2");
            //se puntata di P verifica Diff Meta - Totale
            if (programma101.GetRegA() > 0) {
                this.RZ2();
            } else {
                //se puntata di A vai a Totalizza A
                this.RV3();
            }
        },

        RZ2: function() {
            //verifica Diff  = Meta - Totale
            programma101.Rich("B1");
            programma101.Sottr("B2");
            programma101.Const_progr(2);
            programma101.Sottr("M");
            //se diff > 2 vai a Stampa
            if (programma101.GetRegA() > 0) {
                this.RZ3();
                return;
            }
            //se = 2 verifica se A=2
            programma101.Rich("D1");
            programma101.Sottr("M");
            programma101.Val_ass(0);
            if (programma101.GetRegA() > 0) {
                this.RZ3();
                return;
            }
            //se A =2
            programma101.Const_progr(1);
            programma101.Trasf("C1");
            this.RZ3();
        },

        RZ3: function() {
            //STAMPA P E TOTALE
            //stampa P
            m101x = programma101.GetRegC1();
            //somma P a Totale
            programma101.Rich("B2");
            programma101.Somma("C1");
            programma101.Scambio("B2");
            //stampa Totale Interlinea
            puntx = programma101.GetRegB2();
        },

        controllo_fine_gioco_A: function() {
            programma101.Rich("B1");
            programma101.Sottr("B2");
            if (programma101.GetRegA() == 0) {
                console.log(" HAI VINTO\nPremere Restart Game per ricominciare a giocare.");
                fine = 1;
                return;
            } else if (programma101.GetRegA() < 0) {
            console.log("HAI PERSO!!!");
                fine = 1;
                return;
            }
        },

        controllo_fine_gioco_P: function() {
            fine = 0;
            programma101.Rich("B1");
            programma101.Sottr("B2");
            if (programma101.GetRegA() == 0) {
                console.log("HAI PERSO!!!");
                fine = 1;
            } else if (programma101.GetRegA() < 0) {
                console.log("HAI VINTO!!!");
                fine = 1;
            }
        },

        Gioca: function() {
            this.InizioGioco();
            this.setMeta();
        
            while (fine == 0) {
                var x = parseInt(readline.question('Inserisci la puntata: '));
                this.setPuntata(x);
            }
        }
    }
}

module.exports = AngelaGame;