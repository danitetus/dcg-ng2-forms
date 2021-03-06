/**
 * Created by dcanada on 20/09/16.
 */

import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { TEMPLATE } from './template';


@Component({
    selector: 'dcg-datepicker',
    template: TEMPLATE
})
export class DatepickerComponent implements OnInit {
    @Input() date: Date;
    @Output() dateChange = new EventEmitter();
    @Input() readonly: boolean;
	@Input() view: string;

    public semanas: Array<any> = [];
    public verCalendario: boolean;
    public ano: number;
    public mes: number;
    public dia: number;

	public trimestres: Array<any> = [];

    public mesSig: Date;
    public mesAnt: Date;


    @Input() ver: boolean;
    @ViewChild('boton') boton;

    ngOnInit() {
		this.view = (typeof this.view !== 'string') ? 'dia' : this.view;
		this.view = (this.view.match(/^(dia|mes|ano)$/)) ? this.view : 'dia';

        if (!this.date || this.date === null) {
            this.date = null;
            this.dateChange.emit(null);
            return;
        } else if (typeof this.date === "string") {
            // tenemos que parsearla
            this.date = new Date(this.date);
        }

        this.readonly = (typeof this.readonly === "undefined") ? false : this.readonly;

        this.ano = this.date.getFullYear();
        this.mes = this.date.getMonth();
        this.dia = this.date.getDate();

        // Ahora debemos calcular la vista del mes
        this.aplicar();
        this.calculaMes();

        this.verCalendario = (this.ver || this.ver === true) ? true : false;
    }
    constructor() {
    }

    calculaPosicion() {

    }

    anoChange($event: any) {

    }

    diasEnMes() {
        let dias = [31,28,31,30,31,30,31,31,30,31,30,31];

        if ( (!(this.ano % 4) && this.ano % 100) || !(this.ano % 400)) {
            dias[1] = 29;
        }

        return dias[this.mes];
    }

    setAno() {
        this.aplicar();
        this.calculaMes();
    }

	calculaTrimestres() {

		this.trimestres = [];
		const nom: Array<string> = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
		let i = 0;

		for (let m = 0; m < 12; m++) {
			if (m > 0 && m % 3 === 0) {
				i++;
			}

			const fecha = new Date(this.ano, m, 1, 0, 0, 0, 0);
			this.trimestres[i] = (typeof this.trimestres[i] === 'undefined') ? [] : this.trimestres[i];

			this.trimestres[i].push({
				valor: fecha,
				texto: nom[m]
			});
		}
	}

    calculaMes() {
        if (!this.date || this.date === null) {
            this.date = new Date();
            this.ano = this.date.getFullYear();
            this.mes = this.date.getMonth();
            this.dia = this.date.getDate();
        }

        // obtenemos el día de la semana del día 1 del mes
        let dateTemp = new Date(this.date.getTime());
        dateTemp.setDate(1);

        // dia de la semana
        let diaSemana = dateTemp.getDay() -1;
        diaSemana = (diaSemana < 0) ? 7 : diaSemana;

        // En JS las semanas empiezan por domingo, por lo que es es el día 0
        this.semanas = [];

        let mesActual = this.mes + 0;
        var semana = new Array();

        var i = 0;
        for (i; i < diaSemana; i++) {
            semana.push(null);
        }

        var dia: number;
        while (mesActual === this.mes) {
            // Ahora rellenamos las semanas
            if (i > 6) {
              i = 0;
              this.semanas.push(semana);
              semana = new Array();
            }

            dia = dateTemp.getDate();
            semana.push(dia);
            dateTemp.setDate(dia + 1);
            mesActual = dateTemp.getMonth();
            i++;
        }

        if (semana.length > 0) {
            this.semanas.push(semana);
        }

		this.calculaTrimestres();
    }

    aplicar() {
        if (!this.date || this.date === null) {
            this.date = new Date();
        }
        this.date.setDate(this.dia);
        this.date.setMonth(this.mes);
        this.date.setFullYear(this.ano);
        this.date = new Date(this.date.getTime());

        let mesA = (this.mes === 0) ? 11 : this.mes - 1;
        this.mesAnt = new Date(this.date.getTime());
        this.mesAnt.setDate(1);
        this.mesAnt.setMonth(mesA);

        let mesS = (this.mes === 11) ? 0 : this.mes + 1;
        this.mesSig = new Date(this.date.getTime());
        this.mesSig.setDate(1);
        this.mesSig.setMonth(mesS);
    }
    setDia(dia: number) {
        this.dia = dia;

        this.aplicar();

        this.dateChange.emit(this.date);
        this.toggle(null);
    }

	setMes(mes: Date) {
		mes.setDate(1);
		this.mes = mes.getMonth();
		this.dia = 1;
		this.date = mes;
		this.aplicar();
		this.dateChange.emit(this.date);
		this.toggle(null);
	}

    anoAnterior() {
        this.ano--;
        this.aplicar();
        this.calculaMes();
    }

    anoSiguiente() {
        this.ano++;
        this.aplicar();
        this.calculaMes();
    }

    mesAnterior() {
        if (this.mes === 0) {
            this.ano--;
            this.mes = 11;
        } else {
            this.mes--;
        }

        let dias = this.diasEnMes();

        this.dia = (this.dia <= dias) ? this.dia : dias;
        this.aplicar();
        this.calculaMes();
    }

    mesSiguiente() {
        if (this.mes === 11) {
            this.mes = 0;
            this.ano++;
        } else {
            this.mes++;
        }

        let dias = this.diasEnMes();

        this.dia = (this.dia <= dias) ? this.dia : dias;

        this.aplicar();
        this.calculaMes();
    }

    quitaFecha() {
        this.date = null;
        this.dateChange.emit(this.date);
        this.toggle(null);
    }

    claseDia(dia: number) {
        if (!this.date || this.date === null) {
            return "diaFechaDatePicker";
        }
        if (this.date.getMonth() === this.mes && this.date.getFullYear() === this.ano && this.date.getDate() === dia) {
            return "diaFechaDatePicker diaActivo";
        } else {
            return "diaFechaDatePicker";
        }
    }

	claseMes(mes: Date) {
		if (!this.date || this.date === null) {
            return "diaFechaDatePicker";
        }
        if (this.date.getMonth() === mes.getMonth()) {
            return "diaFechaDatePicker diaActivo";
        } else {
            return "diaFechaDatePicker";
        }
	}


    toggle(ev: any) {
        if (this.readonly === true) {
            this.verCalendario = false;
            alert("No está permitido modificar esta fecha");
            return;
        }

        this.verCalendario = !this.verCalendario;

        if (this.verCalendario === true && this.date === null) {
            this.date = new Date();
            this.ano = this.date.getFullYear();
            this.mes = this.date.getMonth();
            this.dia = this.date.getDate();

            // Ahora debemos calcular la vista del mes
            this.aplicar();
            this.calculaMes();
        }
    }

    getEstiloCaja() {
        if (!this.verCalendario) {
            return {
                display: "none"
            };
        }
        const ancho = (this.boton.offsetWidth <= 200) ? 200 : this.boton.offsetWidth;


        // Posicionamos an absolute
        let btn = this.boton.nativeElement;
        let izq = 0;
        let arriba = btn.offsetHeight;

        return {
            "background-color": "white",
            "top": arriba + "px",
            "left": izq + "px",
            "width": ancho + "px"
        }
    }

    cumulativeOffset = function(element) {
        var top = 0, left = 0;
        do {
            top += element.offsetTop  || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while(element);

        return {
            top: top,
            left: left
        };
    };
}
