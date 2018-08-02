#!/usr/bin/env node
'use strict';

function Programma101() {
    var reg_A, reg_M, reg_R, reg_B1, reg_B2, reg_C1, reg_C2, reg_D1, reg, temp;
    var readline = require('readline-sync');

    return {
        init: function() {
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
        },

        GetRegA: function() {
            return reg_A;
        },

        GetRegM: function() {
            return reg_M;
        },

        SetRegM: function(val) {
            reg_M = val;
        },

        GetRegD1: function() {
            return reg_D1;
        },

        GetRegB2: function() {
            return reg_B2;
        },

        GetRegC1: function() {
            return reg_C1;
        },

        //EMULAZIONE
        Somma: function(val) {
            this.riga_col_E(val);
            reg_M = reg;
            reg_A = reg_A + reg_M;
        },

        Sottr: function(val) {
            this.riga_col_E(val);
            reg_M = reg;
            reg_A = reg_A - reg_M;
        },

        Molt: function(val) {
            this.riga_col_E(val);
            reg_M = reg;
            reg_A = reg_A * reg_M;
        },

        Div: function(val) {
            temp = reg_A;
            //quoziente
            this.riga_col_E(val);
            reg_M = reg;
            reg_A = reg_A / reg_M;
            //resto
            reg_R = temp % reg_M;
        },

        Trasf: function(val) {
            reg = reg_M;
            this.riga_col_U(val);
        },

        Rich: function(val) {
            this.riga_col_E(val);
            reg_A = reg;
        },

        Scambio: function(val) {
            temp = reg_A;
            //richiama registro in A
            this.riga_col_E(val);   
            reg_A = reg;
            //trasferisci temp in registro
            reg = temp;
            this.riga_col_U(val);
        },

        Val_ass: function(val) {
            reg_A = Math.abs(reg_A);
        },

        Const_progr: function(val) {
            reg_M = val;
        },

        Azzera: function(val) {
            reg = 0;
            this.riga_col_U(val);
        },

        riga_col_U: function(val) {
            switch(val) {
                case "A":
                    reg_A = reg;
                    break;
                case "M":
                    reg_M = reg;
                    break;
                case "R":
                    reg_R = reg;
                    break;
                case "B1":
                    reg_B1 = reg;
                    break;
                case "B2":
                    reg_B2 = reg;
                    break;
                case "C1":
                    reg_C1 = reg;
                    break;
                case "C2":
                    reg_C2 = reg;
                    break;
                case "D1":
                    reg_D1 = reg;
                    break;
            }
        },

        riga_col_E: function(val) {
            switch(val) {
                case "A":
                    reg = reg_A;
                    break;
                case "M":
                    reg = reg_M;
                    break;
                case "R":
                    reg = reg_R;
                    break;
                case "B1":
                    reg = reg_B1;
                    break;
                case "B2":
                    reg = reg_B2;
                    break;
                case "C1":
                    reg = reg_C1;
                    break;
                case "C2":
                    reg = reg_C2;
                    break;
                case "D1":
                    reg = reg_D1;
                    break;
            }
        }
    }
}

module.exports = Programma101;