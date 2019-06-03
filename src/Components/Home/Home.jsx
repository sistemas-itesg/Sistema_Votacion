import React,{Component} from 'react';
import NavBar from './../NavBar/NavBar';
import {Modal} from 'react-bootstrap';
import Voting from './../Voting/Voting';
import fire from './../../Config/Config'
import Results from './../Results/Results'
import { firestore } from 'firebase';
class Home extends Component
{
    constructor(props)
    {
        super(props);
        this.state=
        {
            user:this.props.Numero_Control.substr(0,8),
            carrera:'',
            passVisibility:false,
            EventoVotacion:'',
            EventoPass:'',
            votingVisibility:false,
            Participantes:[],
            Resultados:[],
            showModal:false,
            showModalR:false
        }
        this.handleChange=this.handleChange.bind(this);
        this.viewPassElement=this.viewPassElement.bind(this);
        this.cargarListaVotacion=this.cargarListaVotacion.bind(this)
        this.cargarListaResultados=this.cargarListaResultados.bind(this)
        this.votacion=this.votacion.bind(this)
        this.compareDate=this.compareDate.bind(this)
    }
    compareDate(Fecha_Inicio,Hora_Inicio,Fecha_Termino,Hora_Termino)
    {
        var Fecha_Origen = new Date(Fecha_Inicio)
        var Fecha_Finalizacion= new Date(Fecha_Termino)
        let Hora_Origen= Hora_Inicio.split(':')
        let Hora_Finalizacion=Hora_Termino.split(':')
        var Momento = new Date()
        if(Fecha_Origen.getFullYear()=== Momento.getFullYear()-1 && Fecha_Finalizacion.getFullYear()===Momento.getFullYear()-1 || Fecha_Origen.getFullYear() === Momento.getFullYear() && Fecha_Finalizacion.getFullYear()===Momento.getFullYear())
            if((Momento.getMonth()+1)<=(Fecha_Origen.getMonth()+1) && (Momento.getMonth()+1)<=(Fecha_Finalizacion.getMonth()+1))
                if(Momento.getDate()>=(Fecha_Origen.getDate()+1) && Momento.getDate()<=(Fecha_Finalizacion.getDate()+1))
                {
                    if(Momento.getDate() === Fecha_Origen.getDate()+1)
                    {
                        if(Momento.getHours() === parseInt(Hora_Origen[0]))
                            if(Momento.getMinutes() >= parseInt(Hora_Origen[1]))
                                return true
                            else
                                return false
                        if(Momento.getHours() > parseInt(Hora_Origen[0]))
                            return true  
                    }
                    if(Momento.getDate() > Fecha_Origen.getDate()+1 && Momento.getDate() < Fecha_Finalizacion.getDate()+1)
                        return true
                    if(Momento.getDate() === Fecha_Finalizacion.getDate()+1)
                    {
                        if(Momento.getHours() < parseInt(Hora_Finalizacion[0]))
                            return true
                        if(Momento.getHours() === parseInt(Hora_Finalizacion[0]))
                            if(Momento.getMinutes() < parseInt(Hora_Finalizacion[1]))
                                return true
                            else
                                return false
                    }
                    
                        
                }
                else return false;
            else return false;
        else return false;
    }

    handleChange(e)
    {
        this.setState({[e.target.name]:e.target.value});
    }
    viewPassElement()
    {
        if(this.state.passVisibility === true)
            this.setState({passVisibility:false});
        else
            this.setState({passVisibility:true});
    }

    votacion(Nombre,Ruta_Votante,Ruta_Participante)
    {
        if(window.confirm("¿Desea Votar por: "+Nombre+" ?"))
        {
            fire.database().ref().child(Ruta_Participante).once('value',snapshot=>{
                fire.database().ref(Ruta_Participante).update({
                    Votos:Number(snapshot.val().Votos)+1
                }).then(()=>{
                    let usr = fire.auth().currentUser.email.substr(0,8)
                    fire.database().ref(Ruta_Votante+usr).set({
                        Votante:usr
                    }).then(()=>{
                        window.alert("Votacion Realizada con Exito!!!")
                        this.setState({showModal:false})
                    }).catch(()=>{
                        window.alert("Votacion Fallida :'c!!!")
                    })
                })
            })
            
        }
        
    }
    componentDidMount()
    {
        const {user} =this.state
        let carrera
        fire.database().ref('Estudiante/'+user+'/Carrera').once('value').then((snapshot)=>{
            this.setState({carrera:snapshot.val()})
        })
        
       
    }
    cargarListaResultados()
    {
        const {carrera,user,EventoVotacion,EventoPass} = this.state
        let Resultados=[]
        fire.database().ref().child('Evento').on('child_added',snapshot=>{
            if(snapshot.val().Carrera === carrera || snapshot.val().Carrera==='General')
                if(snapshot.val().Nombre_Votacion === EventoVotacion && snapshot.val().Contraseña === EventoPass)
                    fire.database().ref().child('Evento/'+snapshot.key+'/Votantes/'+user).once('value',snap=>{
                        if(snap.hasChildren() || this.state.user === 'superusr')
                            fire.database().ref().child('Evento/'+snapshot.key+'/Participantes').on('child_added',snap=>{
                                Resultados.push({
                                    Id:snap.key,
                                    Nombre:snap.val().Nombre,
                                    Votos:snap.val().Votos,
                    
                                })
                            })
                        else
                            window.alert("Primero debes llevar acabo tu votación antes de poder visualizar los resultados !!!")
                    })                
        })
            this.setState({Resultados,showModalR:true})   
    }
    cargarListaVotacion()
    {
        const {EventoVotacion,EventoPass,user,carrera} = this.state;
        let Participantes =[]
        fire.database().ref().child('Evento').on('child_added',snapshot=>{
            if(snapshot.val().Carrera === carrera || snapshot.val().Carrera==='General')
                if(snapshot.val().Nombre_Votacion === EventoVotacion && snapshot.val().Contraseña === EventoPass)
                    if(this.compareDate(snapshot.val().Fecha_Inicio,snapshot.val().Hora_Inicio, snapshot.val().Fecha_Termino, snapshot.val().Hora_Termino))
                        fire.database().ref().child('Evento/'+snapshot.key+'/Votantes/'+user).once('value',snap=>{
                            if(snap.hasChildren())
                                window.alert("Votacion ya realizada!!!!")
                            else
                                fire.database().ref().child('Evento/'+snapshot.key+'/Participantes').on('child_added',snap=>{
                                    Participantes.push({
                                        Id:snap.key,
                                        Ruta_Participante:'Evento/'+snapshot.key+'/Participantes/'+snap.key,
                                        Ruta_Votante:'Evento/'+snapshot.key+'/Votantes/',
                                        Nombre:snap.val().Nombre,
                                        Participante:snap.val().Participante,
                                        ImagePath:snap.val().ImagePath                        
                                    })
                                })
                        })
                    
        })
            this.setState({Participantes,showModal:true})   
    }
    render()
    {
        const {Participantes,Resultados}=this.state
        return(
            <>
                <div className="container text-center">
                    <div className="center jumbotron">
                        <h2 className="text-primary">Bienvenido:{this.state.user}</h2>
                        <br/>
                        <div className="form">
                            <input 
                                type="text" 
                                onChange={this.handleChange}
                                name="EventoVotacion" 
                                className="form-control"
                                placeholder="Nombre de Identifiacion de la Votación"
                            />
                            <br/>
                            {this.state.passVisibility ?
                                <input 
                                    type="text" 
                                    onChange={this.handleChange}
                                    name="EventoPass" 
                                    className="form-control"
                                    placeholder="Contraseña de acceso en caso de ser necesario para la Votación"
                                />
                            :null}
                            <br/>
                            <div className="btn-group" role="group" aria-label="Button group">
                                {this.state.user != 'superusr' ?<button 
                                    type="submit" 
                                    className="btn btn-success"
                                    name="Votacion" 
                                    onClick={()=>{this.cargarListaVotacion()}
                                    } 
                                >Votar</button>:null}
                                <div className="custom-control custom-checkbox btn btn-primary">
                                    <input type="checkbox" className="custom-control-input" onClick={this.viewPassElement} id="defaultUnchecked"/>
                                    <label className="custom-control-label" htmlFor="defaultUnchecked">Contraseña</label>
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-info"
                                    name="btn_resultados"
                                    onClick={()=>{ this.cargarListaResultados()}
                                    } 
                                >Resultados</button>
                            </div>
                            <Modal show={this.state.showModal} size="xl" onHide={()=>this.setState({showModal:false})}>
                                <Modal.Header closeButton />
                                <Modal.Body>
                                    
                                    {Participantes.length>0 ?
                                    
                                        <ul>
                                            {
                                            this.state.Participantes.map((participante)=>{
                                                    return (
                                                        <Voting
                                                            key={participante.Id}
                                                            Id={participante.Id}
                                                            Participante={participante.Participante}
                                                            Nombre={participante.Nombre}
                                                            ImagePath={participante.ImagePath}
                                                            Ruta_Votante={participante.Ruta_Votante}
                                                            Ruta_Participante={participante.Ruta_Participante}
                                                            Votar={this.votacion}
                                                        />);
                                                })
                                            }
                                        </ul>
                                        :
                                        <div>
                                            <p>Si tarda en aparecer la lista, favor de presionar el siguiente botón.
                                                <button 
                                                className="btn btn-info"
                                                onClick={()=>{
                                                this.setState({showModal:false}) 
                                                this.setState({showModal:true})}}>=></button>
                                            </p>
                                            <br/>
                                            <p>
                                                Por el momento no puedes ver la lista de votación.
                                            </p>
                                        </div>
                                    }
                                </Modal.Body>
                            </Modal>
                        </div>
                    </div>
                    <Modal show={this.state.showModalR} size="xl" onHide={()=>this.setState({showModalR:false})}>
                                <Modal.Header closeButton />

                                <Modal.Body>
                                    {
                                        Resultados.length>0?
                                            <Results Resultados={Resultados}/>
                                        :
                                        <p>
                                            Si tarda en aparecer la lista, favor de presionar el siguiente botón.
                                            <button 
                                            className="btn btn-info"
                                            onClick={()=>{
                                                this.setState({showModalR:false}) 
                                                this.setState({showModalR:true})}}
                                            >=></button>
                                        </p>
                                    }
                                    
                                    
                                </Modal.Body>
                            </Modal>
                    
                </div>
            </>
        );
    }
}
export default Home;