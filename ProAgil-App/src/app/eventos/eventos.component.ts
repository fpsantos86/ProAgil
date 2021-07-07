
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventosFiltrados: Evento[] = [];
  eventos: Evento[] = [];
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  modalRef!: BsModalRef;
  registerForm!: FormGroup;

  _filtroLista = '';

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private fb: FormBuilder,)
    {

    }

    get filtroLista(): string {
      return this._filtroLista;
    }

    set filtroLista(value: string){
      this._filtroLista = value;
      this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
    }

    openModal(template: TemplateRef<any>){
      this.modalRef = this.modalService.show(template);
    }


    ngOnInit() {
      this.validation()
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

    salvarAlteracao(){

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
