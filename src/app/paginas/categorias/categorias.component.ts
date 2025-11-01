import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule} from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaDTO } from '../../dto/categoria-dto';
import { ModeradorService } from '../../servicios/moderador.service';
import { MensajeDTO } from '../../dto/mensaje-dto';
import Swal from 'sweetalert2';
import { ObtenerCategoriaDTO } from '../../dto/obtener-categoria-dto';

@Component({
  selector: 'app-categorias',
  imports: [RouterModule,ReactiveFormsModule,CommonModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})

export class CategoriasComponent implements OnInit{
  categoriaForm!: FormGroup;
  categoria: ObtenerCategoriaDTO[] = [];
  colores: string[] = ['AZUL', 'GRIS', 'VERDE', 'ROJO', 'AMARILLO', 'CELESTE', 'BLANCO', 'TRANSPARENTE'];
  editando:boolean = false;

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  constructor(private formBuilder: FormBuilder, public router: Router, public categoriaService: ModeradorService){
    this.categoriaForm = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      color: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
    })
  }

  public obtenerCategorias(){
    this.categoriaService.obtenerCategorias().subscribe({
      next: (data) => {
        this.categoria = data.mensaje;
        console.log(this.categoria);
      },
      error: (error) => {
        console.log(error.error.contenido);
      }
    });
  }

  public categoriaFormulario(){
    if(this.editando==false){
      const categoria: CategoriaDTO = this.categoriaForm.value;
      this.categoriaService.crearCategoria(categoria).subscribe({
        next: (respuesta: MensajeDTO) => {
          Swal.fire({
            icon: 'success',
            title: 'Categoria creada',
            text: 'Tu categoria ha sido creado exitosamente.',
            confirmButtonText: 'OK'
          }).then(() => {
            this.obtenerCategorias();
            this.categoriaForm.reset();
          });
        },
        error: (error) => {
          const mensaje = typeof error.error === 'string' ? error.error : 'Error al crear la categoria.';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            confirmButtonText: 'Cerrar'
          });
        }
      });
    } else {

    }
  }

  public editarCategoria(idCategoria:string){

  }

  public eliminarCategoria(idCategoria:string){
    Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la categoria. ¿Deseas continuar?',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if(result.isConfirmed){
        this.categoriaService.eliminarCategoria(idCategoria).subscribe({
          next: (respuesta: MensajeDTO) => {
            Swal.fire({
              icon: 'success',
              title: 'Categoria Eliminada',
              text: 'La cagegoria ha sido eliminada exitosamente.',
              confirmButtonText: 'OK'
            }).then(() => {
            });
          },
          error: (error) => {
            const mensaje = typeof error.error === 'string' ? error.error : 'Error al actualizar el usuario.';
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: mensaje,
              confirmButtonText: 'Cerrar'
            });
          }
        });
      }
    });
  }

}