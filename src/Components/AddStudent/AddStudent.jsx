import React,{Component} from 'react';
import fire from './../../Config/Config';
import Login from './../Login/Login';
import {Collapse} from 'react-bootstrap';
class AddStudent extends Component
{
    constructor()
    {
        super();
        /**
         Definicion del estado y las propiedades que tendra la tabla de estudiantes
            -Numero de Control(id,usuario)
            -Nombre
            -Apellidos
            -Carrera
        A su vez se configuran dos variables que ayudaran al proceso de validacion
            errores que es una lista de los errores que el usuario cometa al momento del registro
            status_errorSummary tiene las propiedades de visibilidad para mostrar la lista de errores
         */
         
        this.state={
            Numero_Control:'',
            Nombre:'',
            Apellidos:'',
            Carrera:'Ing. Sistemas Computacionales',
            Contraseña:'',
            errores:[],
            Confirmar_Contraseña:'',
            status_errorSumary:false,
            statusView:true
        }
        //asignacion de funciones para no perder el scope
        this.handleChange=this.handleChange.bind(this);
        this.checkNumero_Control=this.checkNumero_Control.bind(this);
        this.checkPasswords=this.checkPasswords.bind(this);
        this.checkErrors=this.checkErrors.bind(this);
        this.viewState=this.viewState.bind(this);
    }

    viewState()
    {
        if(this.state.statusView === true)
            this.setState({statusView:false})
        else
            this.setState({statusView:true})
    }
    /**
     funciones encargadas de validar que los usuarios cumplan con los parametros del registro
     funcion de validacion de numero de control
     */
    checkNumero_Control()
    {   //primero hay que validar que el campo usuario no este vacio
        if(String(this.state.Numero_Control)!=='')
        {   
            if(this.state.Numero_Control.length === 8)
                //segundo comprobamos que el numero de control sea un numero
                if(Number(this.state.Numero_Control))
                {   /**
                    creamos una variable fecha para validar los usuarios activos puedan registrarse
                    obtenemos la fecha en cuatro digitos yyyy y lo casteamos a numero y eliminamos la fecha completa
                        para obtener solo los 2 ultimos digitos yy
                    */
                    var fecha = Number(new Date().getFullYear())-2000;
                    //comprobamos que el numero de control sea mayor al año (yy-5)111000  y menor a (yy)111000
                    if(this.state.Numero_Control>Number((fecha-5)+"111000") && this.state.Numero_Control<Number((fecha)+"111000"))
                        /**
                        validamos que entre el numero de control tenga los 3 digitos de identificacion de la institucion
                            ejemplo 15111007 -> valido, 15222007 -> invalido
                        */
                        if(String(this.state.Numero_Control).substr(2,3) ==='111')
                            return true;
                        else
                            return false;
                    else
                        return false;
                }
                else
                    return false;
            else
                return false;
        }
        else
            return false;

    }
    //funcion de validacion del password
    checkPasswords()
    {   /**
        comprobamos que el campo no este vacio,
        dentro de las propiedades de la etiqueta para contraseña
        se definio un tamaño minimo de 8 y maximo de 16 de caracteres
        */
        if(this.state.Contraseña!=='')
            {
                //comprobamos que las contraseñas sean similares
                if(this.state.Contraseña === this.state.Confirmar_Contraseña)
                    return true;
                else return false
            }
        else    
            return false;
    }
    //funcion para enlistar errores
    checkErrors()
    {   /**
            primero le preguntamos al usuario si su informacion es valida
            y que el usuario valide que su informacion es correcta
        */
        if(window.confirm('¿Sus datos estan correctos?'))
        {   //variable array para guardar los errores
            var listErrors =[];
            /**
             validamos cada uno de los campos para el registro
             y agregamos las cadenas con cada uno de los errores encontrados
             */
            if(this.checkNumero_Control() === false)
                listErrors.push('El numero de control no pertenece al sistema')

            if(String(this.state.Nombre) === '')
                listErrors.push('El nombre no puede estar vacio');

            if(String(this.state.Apellidos) === '')
                listErrors.push('Los apellidos no pueden estar vacios');

            if(this.state.Contraseña.length<8 || this.state.Confirmar_Contraseña.length<8)
                listErrors.push('La contraseña debe de tener un minimo de 8 caracacteres')
            if(this.checkPasswords() === false)
                listErrors.push('Las constraseñas deben coincidir');
            //verificamos el tamaño del arreglo para los errores
            if(listErrors.length>0)
                    /**
                     si es mayor a 0, es decir se encontro un arreglo,
                     agregamos el arreglo al estado en la variable errores
                     y cambiamos el atributo de visibilidad para mostrar los errores
                     */
                this.setState({errores:listErrors,status_errorSumary:true});
            else
                //en caso de no tener ningun error en la lista pasamos al registro
               this.newStudent();              
        }
        
    }
    //evento para agregar los cambios a los campos del estado
    handleChange(e)
    { 
        /**
         al tener en los campos agregado el mismo nombre que en el estado, es mas sencillo
         agregar cada uno de los estados, ya que lee el campo de name y solo agrega los cambios que 
         se producen en cada uno de los campos
         */
        this.setState({[e.target.name]: e.target.value});
    }
    //funcion para agregar al nuevo usuario
    newStudent()
    {
        //comprobamos que no haya ningun error nuevamente para agregar al nuevo usuario
        if(Array(this.state.errores).length>0)
        {  
            /**
             creamos una variable usuario inicializada en null, aqui validaremos si existe el usuario,
             despues buscamos en la base de datos noSql firebase el valor con una funcion si existe el usuario
             */
            var usuario = null;
            fire.database().ref('Estudiante/'+this.state.Numero_Control).once('value').then(function(snapshot){
                /**
                 si el usuario tiene un valor y un valor con el numero de control, va a cambiar la variable
                 usuario y cambiar el valor inicial de null, asi validaremos su existencia
                 */
                usuario = (snapshot.val() && snapshot.val().Numero_Control);
                //en caso de que el usuario existe mandara un alert para indicar que el usuario existe
                if(usuario !== null)
                    window.alert("El usuario ya existe");
            })
            //en caso de que el usuario siga siendo null agregaremos al usuario
            if(usuario === null)
            {
                //primero agregamos al usuario del login agregando su identidacador + @tecguanajuato.edu.mx
                fire.auth().createUserWithEmailAndPassword(this.state.Numero_Control+'@tecguanajuato.edu.mx',this.state.Contraseña).then((u)=>{
                    /**
                    dentro del mismo campo de creacion de usuario para login validamos que si todo esta bien tambien
                    agrege la siguiente informacion del usuario, sino va a marcar un error.
                    le inficamos que en la tabla estudiante agrege el campo con el id del estudiante
                    y luego su informacion personal
                     */
                    fire.database().ref('Estudiante/' + this.state.Numero_Control).set({
                        //mandamos llamar todos los elementos del estado y los asignamos a variable para la tabla
                        Numero_Control:this.state.Numero_Control,
                        Nombre:this.state.Nombre,
                        Apellidos:this.state.Apellidos,
                        Carrera:this.state.Carrera
                    }).then((success)=>{
                        //en caso de ser exitoso el registro va a mandar un aviso al usuario de que es correcto
                        window.alert('Registro Exitoso')
                    }).catch((fail)=>{
                    console.log(fail);
                    });
                }).catch((error)=>{
                    console.log(error);
                });
            }
        }
    }
    render()
    {
        return(
            <div>
            {this.state.statusView ?
                <div className="container">
                    <div className="center jumbotron">
                        <div className="text-center">
                            <h2>Registro Alumno</h2>
                            <br/>
                            <table className="table">
                                <tbody>
                                <tr>
                                        <td className="text-right">
                                            <label className="text-primary">Numero de Control:</label>
                                        </td>    
                                        <td>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="Numero de Control" 
                                                name="Numero_Control" 
                                                onChange={this.handleChange}
                                                maxLength="8"
                                                minLength="8"
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">
                                            <label className="text-primary">Nombre(s):</label>
                                        </td>
                                        <td>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="Nombre(s)" 
                                                onChange={this.handleChange}
                                                name="Nombre" 
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">
                                            <label className="text-primary">Apellido(s):</label>
                                        </td>
                                        <td>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                placeholder="Apellido(s)" 
                                                onChange={this.handleChange}
                                                name="Apellidos" 
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">
                                            <label className="text-primary" >Carrera:</label>
                                        </td>
                                        <td>
                                            <select className="form-control" onChange={this.handleChange} name="Carrera">
                                                <option defaultValue>Ing. Sistemas Computacionales</option>
                                                <option>Ing. Industrias Alimentarias</option>
                                                <option>Ing. Mecatronica</option>
                                                <option>Ing. Industrial</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">
                                            <label className="text-primary">Contraseña:</label>
                                        </td>
                                        <td>
                                            <input 
                                                type="password" 
                                                className="form-control" 
                                                placeholder="Contraseña" 
                                                name="Contraseña" 
                                                minLength="8"
                                                maxLength="16"
                                                onChange={this.handleChange}
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">
                                            <label className="text-primary">Confirmar Contraseña:</label>
                                        </td>
                                        <td>
                                            <input 
                                                type="password" 
                                                className="form-control" 
                                                placeholder="Confirmar Contraseña" 
                                                onChange={this.handleChange}
                                                name="Confirmar_Contraseña" 
                                                required
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-left">
                                            <button
                                                type="submit"
                                                className="btn btn-danger"
                                                onClick={this.viewState}
                                            >Cancelar</button>
                                        </td>
                                        <td className="text-right">
                                            <button 
                                                type="submit" 
                                                className="btn btn-success"
                                                onClick={this.checkErrors}
                                            >Registrar</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                                <Collapse in={this.state.status_errorSumary}>
                                <div className="card">
                                        <div className="card-header">
                                            <h4 className="text-primary">Errores</h4>
                                        </div>
                                        <div className="card-body bg-danger">
                                                <ol>  
                                                {
                                                    this.state.errores.map((error,i)=>
                                                    {
                                                        return(<li key={i}>{this.state.errores[i]}</li>) 
                                                    })
                                                }     
                                                </ol>
                                            </div> 
                                    </div>
                                </Collapse>
                        </div>
                    </div>
                </div>    
            :<Login/>
            }
            </div>
        );
    }
}
export default AddStudent;