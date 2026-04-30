import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        LoginComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con campos vacíos', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('debería alternar la visibilidad de la contraseña', () => {
    // Al inicio debe estar en false
    expect(component.mostrarPassword).toBeFalse();
    
    // Llamamos al método que implementamos
    component.togglePassword();
    expect(component.mostrarPassword).toBeTrue();
    
    // Volvemos a llamar para ocultar
    component.togglePassword();
    expect(component.mostrarPassword).toBeFalse();
  });

  it('debería validar que el formulario sea inválido si está vacío', () => {
    component.loginForm.get('email')?.setValue('');
    component.loginForm.get('password')?.setValue('');
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('debería validar que el formulario sea válido con datos correctos', () => {
    component.loginForm.get('email')?.setValue('test@uniquindio.edu.co');
    component.loginForm.get('password')?.setValue('1234567');
    expect(component.loginForm.valid).toBeTrue();
  });
});
