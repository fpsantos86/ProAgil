
import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { templateJitUrl } from '@angular/compiler';

defineLocale('pt-br', ptBrLocale)

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventosFiltrados: Evento[] = [];
  eventos: Evento[] = [];

  evento: Evento;
  modoSalvar = 'post';

  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;

  registerForm!: FormGroup;

  _filtroLista = '';

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localeService: BsLocaleService)
    {
      this.localeService.use('pt-br')
    }

    get filtroLista(): string {
      return this._filtroLista;
    }

    set filtroLista(value: string){
      this._filtroLista = value;
      this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
    }

    editarEvento(evento:Evento,template: any){
      this.modoSalvar = 'put';
      this.openModal(template);
      this.evento = evento;
      this.registerForm.patchValue(evento);

    }

    novoEvento(template: any){
      this.modoSalvar = 'post'
      this.openModal(template)
    }

    openModal(template: any){
      this.registerForm.reset();
      template.show();
    }


    ngOnInit() {
      this.validation();
      this.getEventos();
    }


    filtrarEventos(filtrarPor: string):Evento[]{

      filtrarPor = filtrarPor.toLocaleLowerCase();

      return this.eventos.filter(
        evento => evento.tema.toLocaleLowerCase()
        .indexOf(filtrarPor) !== -1);

    }

    alternarImagem(){
      this.mostrarImagem = !this.mostrarImagem
    }

    salvarAlteracao(template: any){
      if(this.registerForm.valid){
        if (this.modoSalvar ==='post'){
          this.evento = Object.assign({}, this.registerForm.value);
          this.eventoService.postEvento(this.evento).subscribe(
            (novoEvento)=> {
              template.hide();
              this.getEventos();
            },
            error=>{
              console.log(error);
            }
          );
        }else{
          this.evento = Object.assign({id:this.evento.id}, this.registerForm.value);
          this.eventoService.putEvento(this.evento).subscribe(
            ()=> {

              template.hide();
              this.getEventos();
            },
            error=>{
              console.log(error);
            }
          );
        }


      }
    }

    validation(){
      this.registerForm = this.fb.group({
        tema: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(4)]],
        local: ['', Validators.required],
        dataEvento: ['', Validators.required],
        imagemURL: ['', Validators.required],
        qtdPessoas: ['',
          [Validators.required, Validators.max(120000)]],
        telefone: ['', Validators.required],
        email: ['',[Validators.required, Validators.email]]

      });
    }

    getEventos(){
      this.eventoService.getAllEvento().subscribe(
        (_eventos: Evento[]) => {
          this.eventos = _eventos;
          this.eventosFiltrados = this.eventos
          console.log(_eventos);
        },
        error =>{
          console.log(error);
        });
    }

}
