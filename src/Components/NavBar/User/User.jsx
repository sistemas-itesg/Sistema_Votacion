import React,{Component} from 'react';
import fire from '../../../Config/Config';
import {Container,Jumbotron,Table,Row,Col} from 'react-bootstrap';
class User extends Component
{
    constructor(props)
    {
        super(props);
        this.state=
        {
            user:fire.auth().currentUser.email.substr(0,8),
            Nombre:'',
            Apellido:'',
            Carrera:'Ing. Sistemas Computacionales'
        }
        this.userView=this.userView.bind(this);
        this.getInfo=this.getInfo.bind(this)
        this.updateInfo=this.updateInfo.bind(this)
        this.handleChange=this.handleChange.bind(this)
    }
    componentDidMount()
    {
        this.getInfo()
    }
    userView()
    {
        if(this.state.user !== 'superusr')
            return true
        else
            return false
    }
    getInfo()
    {
   //     var {userName,userLast,userPass}=this.state;
        if(this.userView)
            fire.database().ref('Estudiante/'+this.state.user).once('value',snapshot=>
            {
               this.setState({
                   Nombre:snapshot.val().Nombre,
                   Apellido:snapshot.val().Apellidos
               })
            })
            
    }
    handleChange(e)
    {
        this.setState({[e.target.name]:e.target.value})
    }
    
    updateInfo()
    {
        const {Nombre,Apellido,Carrera,user}=this.state
        fire.database().ref('Estudiante/'+user).update({
            Nombre,Apellido,Carrera
        }).then(()=>{
            window.alert("Información actualizada")
        }).catch(()=>{
            window.alert("Error intente mas tarde")
        })
    }

    render()
    {
        return(
           <Container className="text-center">
               <Jumbotron className="center">
                   <h2>Información Personal: {this.state.user} </h2>
                    <br/>
                    <Table>
                        {this.userView() ?<>
                        <Row>
                            <Col>Nombre(s):</Col>
                            <Col>
                                <input 
                                    type="text" 
                                    name="Nombre" 
                                    placeholder="Nombre(s)"
                                    value={this.state.Nombre}
                                    className="form-control"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>Apellido(s):</Col>
                            <Col>
                                <input 
                                    type="text" 
                                    name="Apellidos" 
                                    value={this.state.Apellido}
                                    placeholder="Apellido(s)"
                                    className="form-control"
                                    onChange={this.handleChange}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col>Carrera:</Col>
                            <Col>
                                <select className="custom-select" name="Carrera" onChange={this.handleChange}> 
                                    <option value="Ing. Sistemas Computacionales">Ing. Sistemas Computacionales</option>
                                    <option value="Ing. Industrias Alimentarias">Ing. Industrias Alimentarias</option>
                                    <option value="Ing. Mecatronica">Ing. Mecatronica</option>
                                    <option value="Ing. Industrial">Ing. Industrial</option>
                                </select>
                            </Col>
                        </Row>
                        </>:null}
                    </Table>
               </Jumbotron>
                <div className="text-right">
                    <button 
                        type="submit" 
                        className="btn btn-success"
                        onClick={this.updateInfo}
                   >Guardar Cambios
                    </button>
                </div>
                
           </Container>
        );
    }
}
export default User;